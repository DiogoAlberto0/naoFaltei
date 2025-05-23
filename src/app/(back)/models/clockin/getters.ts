import { prisma } from "@/prisma/prisma";

//utils
import { groupBy } from "lodash";
import { dateUtils } from "@/src/utils/date";

//models
import { clockinModel } from "./clockin";
import { scheduleModule } from "../schedule/schedule";

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
        lte: dateUtils.getEndOfDay(date),
      },
    },
    orderBy: {
      clocked_at: "desc",
    },
  });
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
    orderBy: {
      clocked_at: "asc",
    },
  });

  const clockinsGroupByDate = groupBy(clockins, (clockin) =>
    dateUtils.formatToYMD(clockin.clocked_at),
  );

  return clockinsGroupByDate;
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
    await scheduleModule.getExpectedMinuteOfAllWeekDays(workerId);

  for (const date of allDates) {
    if (!summariesGroupByDate[dateUtils.formatToYMD(date)]) {
      const newRegiser = await clockinModel.setAbscentOrBreak(
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

const getClockinsByDate = async (workerId: string, date: Date) => {
  return await prisma.clockin.findMany({
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
};

const countBy = async ({ establishmentId }: { establishmentId?: string }) => {
  return await prisma.clockin.count({
    where: {
      worker: {
        establishment_id: establishmentId,
      },
    },
  });
};

const getLastTwoRegisters = async (workerId: string) => {
  const lastTwoRegisters = await prisma.clockin.findMany({
    where: {
      worker_id: workerId,
    },
    orderBy: {
      clocked_at: "desc",
    },
    take: 2,
  });

  return lastTwoRegisters;
};

export const clockinGetters = {
  getLastRegistersByEstablishment,
  getLastRegisterOfDay,
  getClockisGroupByDate,
  getSummaryByDate,
  getTotalSumariesData,
  getTimeSheetByWorker,
  getClockinsByDate,
  countBy,
  getLastTwoRegisters,
};
