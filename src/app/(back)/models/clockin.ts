import { prisma } from "@/prisma/prisma";

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
  lat: string;
  lng: string;
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

const clockinModel = { register, getLastRegisterToday };

export { clockinModel };
