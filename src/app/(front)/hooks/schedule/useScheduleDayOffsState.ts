import { useState, useEffect } from "react";
import { ISchedule } from "./schedule.types";

export const useScheduleDayOffsState = (prevSchedule?: ISchedule) => {
  const [daysOff, setDaysOff] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!prevSchedule) return;
    const newState: Record<string, boolean> = {};
    for (const [key, { isDayOff }] of Object.entries(prevSchedule)) {
      newState[key] = isDayOff;
    }
    setDaysOff(newState);
  }, [prevSchedule]);

  const toggleDayOff = (key: string) => {
    setDaysOff((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return { daysOff, toggleDayOff };
};
