import { prisma } from "@/prisma/prisma";

// utils
import { dateUtils } from "@/src/utils/date";
import { groupBy } from "lodash";

// models
import { clockinModel, IClockin } from "../clockin/clockin";
import {
  IWorkerScheduleV2,
  scheduleModuleV2,
} from "../scheduleV2/scheduleModuleV2";
import { groupByPeriod } from "@/src/utils/groupby";
import { ITimeSheet } from "../clockin/getters";

type IStatusWorkDaySummary = "present" | "abscent" | "break";

export interface IWorkDaySummary {
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

const setAbscent = async (workerId: string, date: Date) => {
  const newRegiser = await prisma.workDaySummary.create({
    data: {
      worker_id: workerId,
      work_date: date,
      status: "abscent",
    },
  });
  return newRegiser;
};

const setBreak = async (workerId: string, date: Date) => {
  const newRegiser = await prisma.workDaySummary.create({
    data: {
      worker_id: workerId,
      work_date: date,
      status: "break",
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

  const workerSchedule = await scheduleModuleV2.getSchedule(workerId);

  // set absent or break for unregistered dates according worker schedule
  for (const date of allDates) {
    if (!summariesGroupByDate[dateUtils.formatToYMD(date)]) {
      const isDayOff = workerSchedule?.daysOff.every(
        (value) => value === dateUtils.convertNumberToWeekDay(date.getUTCDay()),
      );

      let newRegister;
      if (isDayOff) {
        newRegister = await setBreak(workerId, date);
      } else {
        newRegister = await setAbscent(workerId, date);
      }

      const indexBiggerThanNew = summaries.findIndex(
        (s) => s.work_date > newRegister.work_date,
      );
      const insertionIndex =
        indexBiggerThanNew >= 0 ? indexBiggerThanNew : summaries.length;
      summaries.splice(insertionIndex, 0, newRegister);
    }
  }
  return summaries as IWorkDaySummary[];
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
      const expectedRestedMinutes =
        index == 0
          ? 0
          : dateUtils.calculateMinutesBetween(
              r.clocked_at,
              clockins[index - 1].clocked_at,
            );
      if (expectedRestedMinutes <= 4 * 60)
        restedMinutes += expectedRestedMinutes;
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

  const isMedicalLeave = await prisma.workDaySummary.count({
    where: {
      work_date: dateUtils.getStartOfDay(date),
      worker_id: workerId,
      is_medical_leave: true,
    },
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
      worked_minutes: workedMinutes,
      rested_minutes: restedMinutes,
      worker_id: workerId,
    },
    update: {
      status: "present",
      worked_minutes:
        isMedicalLeave > 0
          ? {
              increment: workedMinutes,
            }
          : workedMinutes,
      rested_minutes: restedMinutes,
    },
  });
};

const getTotalSumariesData = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  const [totalAbscent, totalMedicalLeave, totalTimeBalance] = await Promise.all(
    [
      getAbscentDaysCount(workerId, inicialDate, finalDate),
      getMedicalLeaveDaysCount(workerId, inicialDate, finalDate),
      getTimeBalance(workerId, inicialDate, finalDate),
    ],
  );

  return {
    totalAbscent,
    totalMedicalLeave,
    totalTimeBalance,
  };
};

const getAbscentDaysCount = (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) =>
  prisma.workDaySummary.count({
    where: {
      worker_id: workerId,
      status: "abscent",
      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getStartOfDay(finalDate),
      },
    },
  });

const getMedicalLeaveDaysCount = (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) =>
  prisma.workDaySummary.count({
    where: {
      worker_id: workerId,
      is_medical_leave: true,
      work_date: {
        gte: dateUtils.getStartOfDay(inicialDate),
        lte: dateUtils.getStartOfDay(finalDate),
      },
    },
  });
const getTimeBalance = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  // inst possible to calculate the time balance if worker dont have schedule
  const workerSchedule = await scheduleModuleV2.getSchedule(workerId);
  if (!workerSchedule) return 0;

  const timeSheet = await clockinModel.getTimeSheetByWorker({
    workerId,
    inicialDate,
    finalDate,
  });

  switch (workerSchedule.type) {
    case "day":
      return calculateDailyTimeBalance({ timeSheet, workerSchedule });
    case "week":
      return calculateWeeklyTimeBalance({ timeSheet, workerSchedule });
    case "month":
      //TODO
      return 0;
    default:
      return 0;
  }
};

const calculateDailyTimeBalance = async ({
  timeSheet,
  workerSchedule,
}: {
  timeSheet: ITimeSheet[];
  workerSchedule: IWorkerScheduleV2;
}) => {
  if (workerSchedule?.type !== "day")
    throw new Error("The worker schedule is not daily");
  let timeBalance = 0;
  timeSheet.forEach((daySummary) => {
    const weekDay = dateUtils.convertNumberToWeekDay(
      daySummary.work_date.getUTCDay(),
    );

    if (daySummary.is_medical_leave || daySummary.status === "break") return;
    if (daySummary.status === "abscent") {
      timeBalance -= workerSchedule.daily_minutes[weekDay];
      return;
    }
    if (daySummary.status === "present") {
      timeBalance +=
        daySummary.worked_minutes - workerSchedule.daily_minutes[weekDay];
      return;
    }
  });

  return timeBalance;
};

const calculateWeeklyTimeBalance = async ({
  timeSheet,
  workerSchedule,
}: {
  timeSheet: ITimeSheet[];
  workerSchedule: IWorkerScheduleV2;
}) => {
  if (workerSchedule?.type !== "week")
    throw new Error("The worker schedule is not weekly");
  let timeBalance = 0;

  const timeSheetGroupedByWeek = groupByPeriod(
    timeSheet,
    (workDaySummary) => workDaySummary.work_date,
    "week",
  );

  const expectedMinutesPerDay =
    workerSchedule.week_minutes / (7 - workerSchedule.daysOff.length);

  Object.entries(timeSheetGroupedByWeek).forEach(([, value]) => {
    if (value.length != 7) return;

    const workedMinutes = value.reduce((acc, item) => {
      if (item.is_medical_leave) {
        acc += item.worked_minutes || expectedMinutesPerDay;
        return acc;
      }

      acc += item.worked_minutes;
      return acc;
    }, 0);

    timeBalance += workedMinutes - workerSchedule.week_minutes;
  });

  return timeBalance;
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
