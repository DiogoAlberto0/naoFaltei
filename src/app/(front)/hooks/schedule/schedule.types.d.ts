import { weekDays } from "@/src/utils/date";
export type ISchedule =
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
      daysOff: weekDays[];
    }
  | { type: "week"; week_minutes: number; daysOff: weekDays[] }
  | { type: "month"; month_minutes: number; daysOff: weekDays[] }
  | null;
