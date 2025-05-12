import { prisma } from "@/prisma/prisma";

//utils
import { groupBy } from "lodash";
import { dateUtils } from "@/src/utils/date";
import { randomUUID } from "crypto";

//models
import { clockinGetters } from "./getters";
import { clockinModel } from "./clockin";
import { scheduleModule } from "../schedule/schedule";

//errors
import { InputError } from "@/src/Errors/errors";

const register = async ({
  workerId,
  clocked_at,
  lat,
  lng,
}: {
  clocked_at: Date;
  workerId: string;
  lat: number;
  lng: number;
}) => {
  const lastRegister = await clockinGetters.getLastRegisterOfDay(
    workerId,
    clocked_at,
  );
  const isEntry = !lastRegister || !lastRegister.is_entry;

  await prisma.clockin.create({
    data: {
      clocked_at: clocked_at,
      is_entry: isEntry,
      worker: { connect: { id: workerId } },
      registered_by: workerId,
      lat,
      lng,
      is_auto_generated: false,
    },
  });
  await recalculateSummary(workerId, clocked_at);
};

const registerSummary = async ({
  workerId,
  clocked_at,
  isEntry,
  lastRegisterClock,
}: {
  workerId: string;
  clocked_at: Date;
  isEntry: boolean;
  lastRegisterClock: Date | null;
}) => {
  const startOfDay = dateUtils.getStartOfDay(clocked_at);

  const expectedMinutes = await scheduleModule.getExpectedMinutes(
    workerId,
    clocked_at,
  );

  const workedNow =
    !isEntry && lastRegisterClock
      ? dateUtils.calculateMinutesBetween(lastRegisterClock, clocked_at)
      : 0;

  const restedNow =
    isEntry && lastRegisterClock
      ? dateUtils.calculateMinutesBetween(lastRegisterClock, clocked_at)
      : 0;

  await prisma.workDaySummary.upsert({
    where: {
      worker_id_work_date: {
        worker_id: workerId,
        work_date: startOfDay,
      },
    },
    create: {
      work_date: startOfDay,
      worker_id: workerId,
      expected_minutes: expectedMinutes,
      time_balance: -expectedMinutes,
    },
    update: {
      worked_minutes: {
        increment: workedNow,
      },
      rested_minutes: {
        increment: restedNow,
      },
      time_balance: {
        increment: expectedMinutes == 0 ? 0 : workedNow,
      },
    },
  });
};

const setAbscentOrBreak = async (
  workerId: string,
  date: Date,
  expectedMinutes: number[],
) => {
  if (expectedMinutes[date.getUTCDay()] > 0) {
    const newRegiser = await prisma.workDaySummary.create({
      data: {
        worker_id: workerId,
        work_date: date,
        status: "abscent",
        expected_minutes: expectedMinutes[date.getUTCDay()],
        time_balance: -expectedMinutes[date.getUTCDay()],
      },
    });
    return newRegiser;
  } else {
    const newRegiser = await prisma.workDaySummary.create({
      data: {
        worker_id: workerId,
        work_date: date,
        status: "break",
      },
    });
    return newRegiser;
  }
};

const setMedicalLeave = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  const datesBetween = dateUtils.getAllDatesInRange(inicialDate, finalDate);

  await Promise.all(
    datesBetween.map(async (date) => {
      const workDate = dateUtils.getStartOfDay(date);
      return prisma.workDaySummary.upsert({
        where: {
          worker_id_work_date: {
            worker_id: workerId,
            work_date: workDate,
          },
        },
        create: {
          is_medical_leave: true,
          work_date: workDate,
          worker_id: workerId,
        },
        update: {
          is_medical_leave: true,
        },
      });
    }),
  );
};

const managerRegister = async ({
  managerId,
  workerId,
  establishmentCoords: { lat, lng },
  registers,
}: {
  managerId: string;
  workerId: string;
  establishmentCoords: {
    lat: number;
    lng: number;
  };
  registers: { clockedAt: Date; isEntry: boolean }[];
}) => {
  const data = registers.map((r) => ({
    registered_by: managerId,
    is_entry: r.isEntry,
    clocked_at: r.clockedAt,
    worker_id: workerId,
    lat,
    lng,
    is_auto_generated: false,
  }));

  const registerGroupByDate = groupBy(data, (r) =>
    dateUtils.formatToYMD(r.clocked_at),
  );

  await Promise.all(
    Object.entries(registerGroupByDate).map(async ([key, registers]) => {
      const date = new Date(key);

      const lastRegisters = await clockinModel.getClockinsByDate(
        workerId,
        date,
      );

      const newRegisters = validateAndSortNewClockins([
        ...lastRegisters,
        ...registers,
      ]);

      await deleteManyClockins(workerId, date);

      await createManyClockins(newRegisters);
    }),
  );

  await Promise.all(
    Object.keys(registerGroupByDate).map(async (key) => {
      const date = new Date(key);
      await recalculateSummary(workerId, date);
    }),
  );

  return { count: registers.length };
};

interface IClockin {
  registered_by: string;
  is_entry: boolean;
  clocked_at: Date;
  worker_id: string;
  lat: number;
  lng: number;
  is_auto_generated: boolean;
}
const validateAndSortNewClockins = (clockins: IClockin[]) => {
  const sortedClockins = clockins.sort(
    (r1, r2) => r1.clocked_at.getTime() - r2.clocked_at.getTime(),
  );

  sortedClockins.forEach((register, index) => {
    if (index > 0 && clockins[index - 1].is_entry == register.is_entry)
      throw new InputError({
        message: "Os registros devem ser alternados entre entradas e saídas",
        action:
          "Verifique os novos registros e se o funcionário já possui registros nessas datas",
      });
  });
  return sortedClockins;
};

const createManyClockins = async (clockins: IClockin[]) => {
  await prisma.clockin.createMany({
    data: clockins,
    skipDuplicates: true,
  });
};

const deleteManyClockins = async (workerId: string, date: Date) => {
  await prisma.clockin.deleteMany({
    where: {
      worker_id: workerId,
      clocked_at: {
        gte: dateUtils.getStartOfDay(date),
        lte: dateUtils.getEndOfDay(date),
      },
    },
  });
};

const getClockinsByScheduleRange = async ({
  workerId,
  date,
  startTime,
  endTime,
}: {
  workerId: string;
  date: Date;
  startTime: {
    hour: number;
    minute: number;
  };
  endTime: {
    hour: number;
    minute: number;
  };
}) => {
  const baseDate = new Date(date);
  const gte = new Date(baseDate);
  gte.setUTCHours(startTime.hour, startTime.minute);

  const lte = new Date(baseDate);
  lte.setUTCHours(startTime.hour, startTime.minute);
  lte.setUTCDate(lte.getUTCDate() + 1);
  lte.setUTCHours(startTime.hour, startTime.minute - 1, 59, 999);

  let clockins: IClockin[] = [];

  if (endTime.hour < startTime.hour) {
    clockins = await prisma.clockin.findMany({
      where: {
        worker_id: workerId,
        clocked_at: {
          gte,
          lte,
        },
      },
      orderBy: {
        clocked_at: "asc",
      },
    });
  } else {
    clockins = await prisma.clockin.findMany({
      where: {
        worker_id: workerId,
        clocked_at: {
          gte: dateUtils.getStartOfDay(date),
          lte: dateUtils.getEndOfDay(date),
        },
      },
      orderBy: {
        clocked_at: "asc",
      },
    });
  }

  if (clockins.length % 2 != 0) {
    if (!clockins[0].is_entry)
      clockins.unshift({
        is_entry: true,
        clocked_at: gte,
        lat: 0,
        lng: 0,
        registered_by: randomUUID(),
        worker_id: workerId,
        is_auto_generated: true,
      });
    if (clockins[clockins.length - 1].is_entry)
      clockins.push({
        is_entry: false,
        clocked_at: lte,
        lat: 0,
        lng: 0,
        registered_by: randomUUID(),
        worker_id: workerId,
        is_auto_generated: true,
      });
  }

  return clockins;
};
const recalculateSummary = async (workerId: string, date: Date) => {
  const expectedMinutes = await scheduleModule.getExpectedMinutes(
    workerId,
    date,
  );
  const workerSchduleDay = await scheduleModule.getScheduleByDay(
    workerId,
    date.getUTCDay(),
  );

  let clockins: IClockin[];

  if (workerSchduleDay) {
    const { start_hour, start_minute, end_hour, end_minute } = workerSchduleDay;
    clockins = await getClockinsByScheduleRange({
      workerId,
      date,
      startTime: {
        hour: start_hour,
        minute: start_minute,
      },
      endTime: {
        hour: end_hour,
        minute: end_minute,
      },
    });
  } else {
    clockins = await clockinModel.getClockinsByDate(workerId, date);
  }

  const { restedMinutes, workedMinutes } =
    calculateWorkedAndRestedMinutes(clockins);

  await prisma.workDaySummary.upsert({
    where: {
      worker_id_work_date: {
        worker_id: workerId,
        work_date: dateUtils.getStartOfDay(date),
      },
    },
    create: {
      work_date: dateUtils.getStartOfDay(date),
      status: "present",
      expected_minutes: expectedMinutes,
      worked_minutes: workedMinutes,
      rested_minutes: restedMinutes,
      time_balance: workedMinutes - expectedMinutes,
      worker_id: workerId,
    },
    update: {
      expected_minutes: expectedMinutes,
      status: "present",
      worked_minutes: workedMinutes,
      rested_minutes: restedMinutes,
      time_balance: workedMinutes - expectedMinutes,
    },
  });
};

const calculateWorkedAndRestedMinutes = (clockins: IClockin[]) => {
  let workedMinutes = 0;
  let restedMinutes = 0;

  clockins.forEach((r, index) => {
    if (r.is_entry) {
      if (clockins[index + 1] && clockins[index + 1].is_auto_generated) return;
      restedMinutes +=
        index == 0
          ? 0
          : dateUtils.calculateMinutesBetween(
              r.clocked_at,
              clockins[index - 1].clocked_at,
            );
    } else {
      workedMinutes +=
        index == 0
          ? 0
          : dateUtils.calculateMinutesBetween(
              r.clocked_at,
              clockins[index - 1].clocked_at,
            );
    }
  });

  return { workedMinutes, restedMinutes };
};

export const clockinSetters = {
  register,
  registerSummary,
  setAbscentOrBreak,
  setMedicalLeave,
  managerRegister,
};
