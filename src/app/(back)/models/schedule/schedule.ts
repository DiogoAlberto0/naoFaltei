import { $Enums } from "@prisma/client";

// getters
import {
  getSchedule,
  getScheduleByDay,
  calculateExpectedMinutes,
  getExpectedMinuteOfAllWeekDays,
  getExpectedMinutesByWeekDay,
  getExpectedMinutes,
  getExpectedDays,
} from "./getters";

// setters
import { setSchedule, deleteSchedule } from "./setters";

export type WeekDays =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface IScheduleProps {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  restTimeInMinutes: number;
}

export const WeekDayEnumMap: Record<WeekDays, $Enums.WeekDay> = {
  sunday: $Enums.WeekDay.SUNDAY,
  monday: $Enums.WeekDay.MONDAY,
  tuesday: $Enums.WeekDay.TUESDAY,
  wednesday: $Enums.WeekDay.WEDNESDAY,
  thursday: $Enums.WeekDay.THURSDAY,
  friday: $Enums.WeekDay.FRIDAY,
  saturday: $Enums.WeekDay.SATURDAY,
};

export const WeekDayNumberEnumMap: Record<number, $Enums.WeekDay> = {
  0: $Enums.WeekDay.SUNDAY,
  1: $Enums.WeekDay.MONDAY,
  2: $Enums.WeekDay.TUESDAY,
  3: $Enums.WeekDay.WEDNESDAY,
  4: $Enums.WeekDay.THURSDAY,
  5: $Enums.WeekDay.FRIDAY,
  6: $Enums.WeekDay.SATURDAY,
};

const scheduleModule = {
  getSchedule,
  getScheduleByDay,
  calculateExpectedMinutes,
  getExpectedMinuteOfAllWeekDays,
  getExpectedMinutesByWeekDay,
  getExpectedMinutes,
  getExpectedDays,
  setSchedule,
  deleteSchedule,
};

export { scheduleModule };
