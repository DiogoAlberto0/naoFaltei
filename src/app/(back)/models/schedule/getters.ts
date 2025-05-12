import { prisma } from "@/prisma/prisma";
import { WeekDayNumberEnumMap } from "./schedule";

const getSchedule = async (workerId: string) => {
  const schedules = await prisma.workerSchedule.findMany({
    where: { worker_id: workerId },
    orderBy: {
      week_day: "asc",
    },
  });

  const schedulesObj = Object.fromEntries(
    schedules.map(
      ({
        week_day,
        start_hour,
        start_minute,
        end_hour,
        end_minute,
        rest_time_in_minutes,
        is_day_off,
      }) => [
        week_day.toLowerCase(),
        {
          startHour: start_hour,
          startMinute: start_minute,
          endHour: end_hour,
          endMinute: end_minute,
          restTimeInMinutes: rest_time_in_minutes,
          isDayOff: is_day_off,
        },
      ],
    ),
  );

  return schedulesObj;
};

const getScheduleByDay = async (workerId: string, weekDay: number) => {
  return await prisma.workerSchedule.findFirst({
    where: { worker_id: workerId, week_day: WeekDayNumberEnumMap[weekDay] },
  });
};

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

const getExpectedMinuteOfAllWeekDays = async (workerId: string) => {
  const schedule = await getSchedule(workerId);
  const expectedMinutes = Object.values(schedule).map((value) =>
    calculateExpectedMinutes({
      start: {
        hour: value.startHour,
        minute: value.startMinute,
      },
      end: {
        hour: value.endHour,
        minute: value.endMinute,
      },
      restTime: value.restTimeInMinutes,
    }),
  );

  return expectedMinutes;
};

const getExpectedMinutesByWeekDay = async (
  workerId: string,
  weekDayNumber: number,
) => {
  const scheduleDay = await getScheduleByDay(workerId, weekDayNumber);
  if (!scheduleDay) return 0;
  return calculateExpectedMinutes({
    start: {
      hour: scheduleDay.start_hour,
      minute: scheduleDay.start_minute,
    },
    end: {
      hour: scheduleDay.end_hour,
      minute: scheduleDay.end_minute,
    },
    restTime: scheduleDay.rest_time_in_minutes,
  });
};

const getExpectedMinutes = async (workerId: string, date: Date) => {
  const scheduleDay = await getScheduleByDay(workerId, date.getUTCDay());
  if (!scheduleDay) return 0;
  return calculateExpectedMinutes({
    start: {
      hour: scheduleDay.start_hour,
      minute: scheduleDay.start_minute,
    },
    end: {
      hour: scheduleDay.end_hour,
      minute: scheduleDay.end_minute,
    },
    restTime: scheduleDay.rest_time_in_minutes,
  });
};

const getExpectedDays = async (workerId: string) => {
  const expectedDays = await prisma.workerSchedule.findMany({
    where: {
      worker_id: workerId,
    },
    select: {
      week_day: true,
    },
  });

  return expectedDays.map((day) => {
    return day.week_day.toLowerCase();
  });
};

export {
  getSchedule,
  getScheduleByDay,
  calculateExpectedMinutes,
  getExpectedMinuteOfAllWeekDays,
  getExpectedMinutesByWeekDay,
  getExpectedMinutes,
  getExpectedDays,
};
