import { prisma } from "@/prisma/prisma";

//utils
import { groupBy } from "lodash";
import { dateUtils } from "@/src/utils/date";

//models

import {
  IWorkDaySummary,
  workDaySummaryModel,
} from "../workDaySummary/workDaySummary";
import { IClockin } from "./clockin";

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

export interface ITimeSheet extends IWorkDaySummary {
  registers: IClockin[];
}
const getTimeSheetByWorker = async ({
  workerId,
  inicialDate,
  finalDate,
}: {
  workerId: string;
  inicialDate: Date;
  finalDate: Date;
}): Promise<ITimeSheet[]> => {
  const clockinsGroupByDate = await getClockisGroupByDate(
    workerId,
    inicialDate,
    finalDate,
  );

  const summary = await workDaySummaryModel.getSummaryByDate(
    workerId,
    inicialDate,
    finalDate,
  );

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
  getTimeSheetByWorker,
  getClockinsByDate,
  countBy,
  getLastTwoRegisters,
};
