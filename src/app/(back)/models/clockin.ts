import { prisma } from "@/prisma/prisma";
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
const getLastRegisterToday = async (workerId: string) => {
  const today = new Date();
  return await prisma.clockin.findFirst({
    where: {
      worker: { id: workerId },
      clocked_at: {
        gte: dateUtils.getStartOfDay(today),
        lt: dateUtils.getEndOfDay(today),
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
  const lastRegister = await getLastRegisterToday(workerId);
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

const clockinModel = {
  register,
  getLastRegisterToday,
  getLastRegistersByEstablishment,
};

export { clockinModel };
