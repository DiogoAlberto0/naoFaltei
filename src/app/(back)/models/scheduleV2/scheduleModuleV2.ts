import { prisma } from "@/prisma/prisma";
import { InputError } from "@/src/Errors/errors";

type ScheduleType = "day" | "week" | "month" | "nothing";

type weekDays =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

interface ISchedule {
  id: string;
  worker_id: string;
  type: ScheduleType;
  week_minutes: number | null;
  month_minutes: number | null;
  sunday_minutes: number | null;
  monday_minutes: number | null;
  tuesday_minutes: number | null;
  wednesday_minutes: number | null;
  thursday_minutes: number | null;
  friday_minutes: number | null;
  saturday_minutes: number | null;
}

const deleteSchedule = async ({ workerId }: { workerId: string }) => {
  return await prisma.workerScheduleV2.deleteMany({
    where: {
      worker_id: workerId,
    },
  });
};
const createOrUpdate = async ({
  workerId,
  type,
  week_minutes,
  month_minutes,
  sunday_minutes,
  monday_minutes,
  tuesday_minutes,
  wednesday_minutes,
  thursday_minutes,
  friday_minutes,
  saturday_minutes,
  daysOff,
}: {
  workerId: string;
  type: ScheduleType;
  week_minutes?: number;
  month_minutes?: number;
  sunday_minutes?: number;
  monday_minutes?: number;
  tuesday_minutes?: number;
  wednesday_minutes?: number;
  thursday_minutes?: number;
  friday_minutes?: number;
  saturday_minutes?: number;
  daysOff: weekDays[];
}): Promise<ISchedule> => {
  if (type === "nothing") {
    await deleteSchedule({ workerId });
    return {
      id: "0",
      worker_id: workerId,
      type: "nothing",
      week_minutes: null,
      month_minutes: null,
      sunday_minutes: null,
      monday_minutes: null,
      tuesday_minutes: null,
      wednesday_minutes: null,
      thursday_minutes: null,
      friday_minutes: null,
      saturday_minutes: null,
    };
  }
  if (
    type === "day" &&
    (typeof sunday_minutes !== "number" ||
      typeof monday_minutes !== "number" ||
      typeof tuesday_minutes !== "number" ||
      typeof wednesday_minutes !== "number" ||
      typeof thursday_minutes !== "number" ||
      typeof friday_minutes !== "number" ||
      typeof saturday_minutes !== "number")
  )
    throw new InputError({
      message: "Escala para dias inválida",
      action:
        "Verifique se o tempo de trabalho de todos os dias foram informados",
    });

  if (type === "week" && typeof week_minutes != "number")
    throw new InputError({
      message: "Escala para horas semanais inválida",
      action:
        "Verifique se o tempo de trabalho por semana foi informado e é um numero",
    });

  if (type === "month" && typeof month_minutes != "number")
    throw new InputError({
      message: "Escala para horas mensais inválida",
      action:
        "Verifique se o tempo de trabalho por mês foi informado e é um numero",
    });
  const createdSchedule = (await prisma.workerScheduleV2.upsert({
    where: {
      worker_id: workerId,
    },
    create: {
      type,
      week_minutes,
      month_minutes,
      sunday_minutes,
      monday_minutes,
      tuesday_minutes,
      wednesday_minutes,
      thursday_minutes,
      friday_minutes,
      saturday_minutes,
      worker_id: workerId,
      daysOff,
    },
    update: {
      type,
      week_minutes: type == "week" ? week_minutes : null,
      month_minutes: type == "month" ? month_minutes : null,
      sunday_minutes: type == "day" ? sunday_minutes : null,
      monday_minutes: type == "day" ? monday_minutes : null,
      tuesday_minutes: type == "day" ? tuesday_minutes : null,
      wednesday_minutes: type == "day" ? wednesday_minutes : null,
      thursday_minutes: type == "day" ? thursday_minutes : null,
      friday_minutes: type == "day" ? friday_minutes : null,
      saturday_minutes: type == "day" ? saturday_minutes : null,
      daysOff,
    },
  })) as ISchedule;

  return createdSchedule;
};

type WorkerScheduleV2Response =
  | {
      type: "day";
      daily_minutes: {
        sunday: number;
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
      };
    }
  | { type: "week"; week_minutes: number }
  | { type: "month"; month_minutes: number }
  | null;

const getScheduleV2 = async (
  workerId: string,
): Promise<WorkerScheduleV2Response> => {
  const schedule = await prisma.workerScheduleV2.findUnique({
    where: { worker_id: workerId },
  });

  if (!schedule) return null;

  switch (schedule.type as ScheduleType) {
    case "day":
      return {
        type: "day",
        daily_minutes: {
          sunday: schedule.sunday_minutes ?? 0,
          monday: schedule.monday_minutes ?? 0,
          tuesday: schedule.tuesday_minutes ?? 0,
          wednesday: schedule.wednesday_minutes ?? 0,
          thursday: schedule.thursday_minutes ?? 0,
          friday: schedule.friday_minutes ?? 0,
          saturday: schedule.saturday_minutes ?? 0,
        },
      };
    case "week":
      return {
        type: "week",
        week_minutes: schedule.week_minutes ?? 0,
      };
    case "month":
      return {
        type: "month",
        month_minutes: schedule.month_minutes ?? 0,
      };
    default:
      throw new Error("Tipo de escala inválido.");
  }
};

const scheduleModuleV2 = {
  createOrUpdate,
  getScheduleV2,
};

export { scheduleModuleV2 };
