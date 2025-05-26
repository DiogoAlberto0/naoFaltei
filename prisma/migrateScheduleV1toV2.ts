import { prisma } from "@/prisma/prisma";
import { $Enums, WorkerSchedule } from "@prisma/client";

const calculateExpectedMinutes = ({
  start,
  end,
  restTime,
}: {
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  restTime: number;
}) => {
  const startTime = start.hour * 60 + start.minute;
  let endTime = end.hour * 60 + end.minute;
  if (endTime < startTime) {
    endTime += 1440;
  }

  return endTime - startTime - restTime;
};
const main = async () => {
  const workerSchedulesV1 = await prisma.workerSchedule.findMany();

  const groupedByWorker = workerSchedulesV1.reduce(
    (acc, schedule) => {
      const key = schedule.worker_id;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(schedule);

      return acc;
    },
    {} as Record<string, WorkerSchedule[]>,
  );

  let counter = 0;

  for (const [key, value] of Object.entries(groupedByWorker)) {
    console.log(`Migrando worker_id ${key}...`);

    const daysOff: string[] = [];
    const calculateMinutes = (weekDay: $Enums.WeekDay) => {
      const existentSchedule = value.find(
        (schedule) => schedule.week_day === weekDay,
      );

      if (!existentSchedule) return null;
      if (existentSchedule.is_day_off) {
        daysOff.push(weekDay.toLowerCase());
        return 0;
      }

      const minutesBetween = calculateExpectedMinutes({
        start: {
          hour: existentSchedule.start_hour,
          minute: existentSchedule.start_minute,
        },
        end: {
          hour: existentSchedule.end_hour,
          minute: existentSchedule.end_minute,
        },
        restTime: existentSchedule.rest_time_in_minutes,
      });

      return minutesBetween;
    };

    if (await prisma.workerScheduleV2.findUnique({ where: { worker_id: key } }))
      return;

    await prisma.workerScheduleV2.create({
      data: {
        worker_id: key,
        type: "day",
        week_minutes: null,
        month_minutes: null,
        sunday_minutes: calculateMinutes("SUNDAY"),
        monday_minutes: calculateMinutes("MONDAY"),
        tuesday_minutes: calculateMinutes("TUESDAY"),
        wednesday_minutes: calculateMinutes("WEDNESDAY"),
        thursday_minutes: calculateMinutes("THURSDAY"),
        friday_minutes: calculateMinutes("FRIDAY"),
        saturday_minutes: calculateMinutes("SATURDAY"),
        daysOff,
      },
    });
    counter++;
  }
  console.log(`${counter} escalas migradas!`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
