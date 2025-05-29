import { prisma } from "@/prisma/prisma";
import { dateUtils } from "@/src/utils/date";
import { clockinModel, IClockin } from "../clockin/clockin";
import { scheduleModule } from "../schedule/schedule";
import { groupBy } from "lodash";

type IStatusWorkDaySummary = "present" | "abscent" | "break";

interface IWorkDaySummary {
  id: string;
  worker_id: string;
  status: IStatusWorkDaySummary;
  work_date: Date;
  expected_minutes: number;
  worked_minutes: number;
  rested_minutes: number;
  time_balance: number;
  is_medical_leave: boolean;
}

const countBetweenDates = async ({
  workerId,
  inicialDate,
  finalDate,
  status,
  isMedicalLeave,
}: {
  status?: IStatusWorkDaySummary;
  workerId?: string;
  inicialDate: Date;
  finalDate: Date;
  isMedicalLeave?: boolean;
}): Promise<number> => {
  return await prisma.workDaySummary.count({
    where: {
      worker_id: workerId,
      status,
      is_medical_leave: isMedicalLeave,
      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getStartOfDay(finalDate),
      },
    },
  });
};

const getBetweenDates = async ({
  workerId,
  inicialDate,
  finalDate,
}: {
  workerId?: string;
  inicialDate: Date;
  finalDate: Date;
}): Promise<IWorkDaySummary[]> => {
  const summaries = await prisma.workDaySummary.findMany({
    where: {
      worker_id: workerId,

      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getEndOfDay(finalDate),
      },
    },
  });

  return summaries.map((summary) => ({
    ...summary,
    status: summary.status as IStatusWorkDaySummary,
  }));
};

const create = async ({
  workerId,
  date,
  status,
  expectedMinutes,
  timeBalance,
}: {
  workerId: string;
  date: Date;
  status: IStatusWorkDaySummary;
  expectedMinutes?: number;
  timeBalance?: number;
}) => {
  const newRegiser = await prisma.workDaySummary.create({
    data: {
      worker_id: workerId,
      work_date: date,
      status,
      expected_minutes: expectedMinutes,
      time_balance: timeBalance,
    },
  });
  return newRegiser;
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

const calculateWorkedAndRestedMinutes = (clockins: IClockin[]) => {
  if (!clockins[0].is_entry) {
    clockins.unshift({
      clocked_at: dateUtils.getStartOfDay(clockins[0].clocked_at),
      is_entry: true,
      lat: 0,
      lng: 0,
      is_auto_generated: true,
      worker_id: clockins[0].worker_id,
      registered_by: clockins[0].registered_by,
    });
  }

  if (clockins[clockins.length - 1].is_entry) {
    clockins.push({
      clocked_at: dateUtils.getEndOfDay(clockins[0].clocked_at),
      is_entry: false,
      lat: 0,
      lng: 0,
      is_auto_generated: true,
      worker_id: clockins[0].worker_id,
      registered_by: clockins[0].registered_by,
    });
  }

  let workedMinutes = 0;
  let restedMinutes = 0;

  clockins.forEach((r, index) => {
    if (r.is_entry) {
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
const recalculateSummary = async (workerId: string, date: Date) => {
  const clockins = await clockinModel.getClockinsByDate(workerId, date);

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
      worked_minutes: workedMinutes,
      rested_minutes: restedMinutes,
      worker_id: workerId,
    },
    update: {
      status: "present",
      worked_minutes: workedMinutes,
      rested_minutes: restedMinutes,
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

  return {
    totalAbscent,
    totalMedicalLeave,
  };
};

const workDaySummaryModel = {
  countBetweenDates,
  getBetweenDates,
  create,
  getSummaryByDate,
  recalculateSummary,
  getTotalSumariesData,
};

export { workDaySummaryModel };
