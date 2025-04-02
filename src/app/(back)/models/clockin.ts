import { prisma } from "@/prisma/prisma";
import { workerModel } from "./worker";
import { establishmentModel } from "./establishment";

const getLastRegisterToday = async (workerId: string) => {
  const today = new Date();
  return await prisma.clockin.findFirst({
    where: {
      worker: { id: workerId },
      dateTime: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    },
    orderBy: {
      dateTime: "desc",
    },
  });
};
const register = async ({
  workerId,
  dateTime,
}: {
  dateTime: Date;
  workerId: string;
  lat: string;
  lng: string;
}) => {
  const lastRegister = await getLastRegisterToday(workerId);
  const schedule = await workerModel.getSchedule(workerId);
  const localeEstablishment = await establishmentModel.getLocaleInfos({
    workerId,
  });

  const isEntry = () => {
    if (!lastRegister) return true;

    return !lastRegister.is_entry;
  };

  const isTardiness = () => {
    if (!schedule) return false; // Garante que `schedule` existe

    const dayOfWeek = dateTime
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const scheduleOfDay = schedule[dayOfWeek];

    if (!scheduleOfDay || scheduleOfDay.isDayOff) return false; // Verifica se há um horário para esse dia

    // Se não há último registro, verificar se já passou do horário de entrada
    if (!lastRegister) {
      const currentHour = dateTime.getHours();
      const currentMinute = dateTime.getMinutes();

      const { startHour, startMinute } = scheduleOfDay; // Supondo que startMinute exista

      if (currentHour > startHour) return true;
      if (currentHour === startHour && currentMinute > startMinute) return true;
    }

    return false;
  };

  await prisma.clockin.create({
    data: {
      date_time: dateTime,
      is_entry: isEntry(),
      is_tardiness: isTardiness(),
      worker: { connect: { id: workerId } },
      registered_by: workerId,
      lat,
      lng,
    },
  });
};

const clockinModel = { register };

export { clockinModel };
