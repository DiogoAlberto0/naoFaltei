import { prisma } from "@/prisma/prisma";
import { groupBy } from "lodash";
import { dateUtils } from "@/src/utils/date";
import { workerModel } from "./worker";

const getLastRegistersByEstablishment = async (
  establishmentId: string,
  page: number,
  pageSize: number,
) => {
  const safePage = Math.max(1, page);
  return await prisma.clockin.findMany({
    where: {
      worker: { establishment: { id: establishmentId } },
    },
    select: {
      id: true,
      clocked_at: true,
      is_entry: true,
      worker: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    take: pageSize,
    skip: (safePage - 1) * pageSize,
    orderBy: {
      clocked_at: "desc",
    },
  });
};
const getLastRegisterOfDay = async (workerId: string, date: Date) => {
  return await prisma.clockin.findFirst({
    where: {
      worker: { id: workerId },
      clocked_at: {
        gte: dateUtils.getStartOfDay(date),
        lt: dateUtils.getEndOfDay(date),
      },
    },
    orderBy: {
      clocked_at: "desc",
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
  const lastRegister = await getLastRegisterOfDay(workerId, clocked_at);
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
const getClockisGroupByDate = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  const clockins = await prisma.clockin.findMany({
    where: {
      worker_id: workerId,
      clocked_at: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getEndOfDay(finalDate),
      },
    },
  });

  const clockinsGroupByDate = groupBy(clockins, (clockin) =>
    dateUtils.formatToYMD(clockin.clocked_at),
  );

  return clockinsGroupByDate;
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
const getSummaryByDate = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  const allDates = dateUtils.getAllDatesInRange(
    dateUtils.getStartOfDay(inicialDate),
    dateUtils.getEndOfDay(finalDate),
  );
  const summaries = await prisma.workDaySummary.findMany({
    where: {
      worker_id: workerId,

      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getEndOfDay(finalDate),
      },
    },
  });

  const summariesGroupByDate = groupBy(summaries, (summary) =>
    dateUtils.formatToYMD(summary.work_date),
  );

  const expectedMinutes =
    await workerModel.getExpectedMinuteOfAllWeekDays(workerId);

  for (const date of allDates) {
    if (!summariesGroupByDate[dateUtils.formatToYMD(date)]) {
      const newRegiser = await setAbscentOrBreak(
        workerId,
        date,
        expectedMinutes,
      );
      const indexBiggerThanNew = summaries.findIndex(
        (s) => s.work_date > newRegiser.work_date,
      );
      const insertionIndex =
        indexBiggerThanNew >= 0 ? indexBiggerThanNew : summaries.length;
      summaries.splice(insertionIndex, 0, newRegiser);
    }
  }
  return summaries;
};

const getTotalSumariesData = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  const totalAbscent = await prisma.workDaySummary.count({
    where: {
      worker_id: workerId,
      status: "abscent",
      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getStartOfDay(finalDate),
      },
    },
  });

  const totalMedicalLeave = await prisma.workDaySummary.count({
    where: {
      worker_id: workerId,
      is_medical_leave: true,
      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getStartOfDay(finalDate),
      },
    },
  });
  const {
    _sum: { time_balance: totalTimeBalance },
  } = await prisma.workDaySummary.aggregate({
    _sum: {
      time_balance: true,
    },
    where: {
      worker_id: workerId,
      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getStartOfDay(finalDate),
      },
    },
  });

  return {
    totalAbscent,
    totalMedicalLeave,
    totalTimeBalance,
  };
};
const getTimeSheetByWorker = async ({
  workerId,
  inicialDate,
  finalDate,
}: {
  workerId: string;
  inicialDate: Date;
  finalDate: Date;
}) => {
  const clockinsGroupByDate = await getClockisGroupByDate(
    workerId,
    inicialDate,
    finalDate,
  );

  const summary = await getSummaryByDate(workerId, inicialDate, finalDate);

  return summary.map((s) => ({
    ...s,
    registers: clockinsGroupByDate[dateUtils.formatToYMD(s.work_date)] || [],
  }));
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

const clockinModel = {
  register,
  getLastRegisterOfDay,
  getLastRegistersByEstablishment,
  getTimeSheetByWorker,
  getTotalSumariesData,
  setMedicalLeave,
};

export { clockinModel };
