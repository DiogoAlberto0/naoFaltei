import { prisma } from "@/prisma/prisma";

//utils
import { groupBy } from "lodash";
import { dateUtils } from "@/src/utils/date";

//models
import { workerModel } from "../worker";
import { clockinGetters } from "./getters";
import { clockinModel } from "./clockin";

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

  await registerSummary({
    workerId,
    clocked_at,
    isEntry,
    lastRegisterClock: lastRegister?.clocked_at || null,
  });

  await prisma.clockin.create({
    data: {
      clocked_at: clocked_at,
      is_entry: isEntry,
      worker: { connect: { id: workerId } },
      registered_by: workerId,
      lat,
      lng,
    },
  });
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

  const expectedMinutes = await workerModel.getExpectedMinutes(
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
  }));

  const registerGroupByDate = groupBy(data, (r) =>
    dateUtils.formatToYMD(r.clocked_at),
  );

  if (Object.keys(registerGroupByDate).length > 10)
    throw new InputError({
      message: "O máximo de registros para alteração são 10 dias",
      action: "Reduza o número de dias para registro",
    });

  for (const key in registerGroupByDate) {
    const date = new Date(key);

    await prisma.clockin.deleteMany({
      where: {
        worker_id: workerId,
        clocked_at: {
          gte: dateUtils.getStartOfDay(date),
          lte: dateUtils.getEndOfDay(date),
        },
      },
    });

    if (
      registerGroupByDate[key][registerGroupByDate[key].length - 1].is_entry
    ) {
      const clockedAt = new Date(date);
      clockedAt.setUTCHours(23, 59, 59, 999);
      registerGroupByDate[key].push({
        registered_by: managerId,
        is_entry: false,
        clocked_at: clockedAt,
        worker_id: workerId,
        lat,
        lng,
      });
    }

    if (registerGroupByDate[key][0].is_entry == false) {
      const clockedAt = new Date(date);
      clockedAt.setUTCHours(0, 0, 0, 0);
      registerGroupByDate[key].push({
        registered_by: managerId,
        is_entry: true,
        clocked_at: clockedAt,
        worker_id: workerId,
        lat,
        lng,
      });
    }

    await prisma.clockin.createMany({
      data: registerGroupByDate[key].sort(
        (a, b) => a.clocked_at.getTime() - b.clocked_at.getTime(),
      ),
      skipDuplicates: true,
    });

    await recalculateSummary(workerId, date);
  }

  return { count: registers.length };
};

const recalculateSummary = async (workerId: string, date: Date) => {
  const expectedMinutes = await workerModel.getExpectedMinutes(workerId, date);
  let workedMinutes = 0;
  let restedMinutes = 0;
  const registersOfDay = await clockinModel.getClockinsByDate(workerId, date);

  registersOfDay.forEach((r, index) => {
    if (r.is_entry) {
      restedMinutes +=
        index == 0
          ? 0
          : dateUtils.calculateMinutesBetween(
              r.clocked_at,
              registersOfDay[index - 1].clocked_at,
            );
    } else {
      workedMinutes +=
        index == 0
          ? 0
          : dateUtils.calculateMinutesBetween(
              r.clocked_at,
              registersOfDay[index - 1].clocked_at,
            );
    }
  });

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
      worked_minutes: workedMinutes,
      rested_minutes: restedMinutes,
      time_balance: workedMinutes - expectedMinutes,
    },
  });
};

export const clockinSetters = {
  register,
  registerSummary,
  setAbscentOrBreak,
  setMedicalLeave,
  managerRegister,
};
