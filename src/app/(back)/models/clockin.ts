import { prisma } from "@/prisma/prisma";

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
      date_time: true,
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
      date_time: "desc",
    },
  });
};
const getLastRegisterToday = async (workerId: string) => {
  const today = new Date();
  return await prisma.clockin.findFirst({
    where: {
      worker: { id: workerId },
      date_time: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    },
    orderBy: {
      date_time: "desc",
    },
  });
};
const register = async ({
  workerId,
  dateTime,
  isEntry,
  isTardiness,
  lat,
  lng,
}: {
  dateTime: Date;
  workerId: string;
  isEntry: boolean;
  isTardiness: boolean;
  lat: number;
  lng: number;
}) => {
  await prisma.clockin.create({
    data: {
      date_time: dateTime,
      is_entry: isEntry,
      is_tardiness: isTardiness,
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
