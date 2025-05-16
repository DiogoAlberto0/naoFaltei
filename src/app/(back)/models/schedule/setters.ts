import { prisma } from "@/prisma/prisma";

// types
import { IScheduleProps, WeekDayEnumMap, WeekDays } from "./schedule";

interface ICreateSchedule {
  workerId: string;
  schedule: Record<WeekDays, IScheduleProps | null>;
}

const setSchedule = async ({ workerId, schedule }: ICreateSchedule) => {
  await deleteSchedule(workerId);
  for (const [day, shift] of Object.entries(schedule) as [
    WeekDays,
    IScheduleProps | null,
  ][]) {
    const weekDayEnum = WeekDayEnumMap[day]; // Converte para o Enum correto

    if (!weekDayEnum) continue; // Evita erro caso o dia seja inválido
    await prisma.workerSchedule.create({
      data: {
        worker_id: workerId,
        week_day: weekDayEnum,
        start_hour: shift?.startHour ?? 0,
        start_minute: shift?.startMinute ?? 0,
        end_hour: shift?.endHour ?? 0,
        end_minute: shift?.endMinute ?? 0,
        rest_time_in_minutes: shift?.restTimeInMinutes ?? 0,
        is_day_off: shift === null,
      },
    });
  }
};

const deleteSchedule = async (workerId: string) => {
  await prisma.workerSchedule.deleteMany({
    where: {
      worker_id: workerId,
    },
  });
};

export { setSchedule, deleteSchedule };
