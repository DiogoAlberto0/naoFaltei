import { fetcher } from "@/src/utils/fetcher";
import useSWR from "swr";
import { ISchedule, IScheduleArray } from "./schedule.types";

const fakeSchedule: ISchedule = {
  sunday: {
    startHour: 0,
    startMinute: 0,
    endHour: 0,
    endMinute: 0,
    restTimeInMinutes: 0,
    isDayOff: true,
  },
  monday: {
    startHour: 9,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    restTimeInMinutes: 60,
    isDayOff: false,
  },
  tuesday: {
    startHour: 9,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    restTimeInMinutes: 60,
    isDayOff: false,
  },
  wednesday: {
    startHour: 9,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    restTimeInMinutes: 60,
    isDayOff: false,
  },
  thursday: {
    startHour: 9,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    restTimeInMinutes: 60,
    isDayOff: false,
  },
  friday: {
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    restTimeInMinutes: 60,
    isDayOff: false,
  },
  saturday: {
    startHour: 0,
    startMinute: 0,
    endHour: 0,
    endMinute: 0,
    restTimeInMinutes: 0,
    isDayOff: true,
  },
};

export const useScheduleByWorker = ({
  workerId,
  isDemo = false,
}: {
  workerId: string;
  isDemo?: boolean;
}) => {
  const { data, error, isLoading, mutate } = useSWR<ISchedule>(
    isDemo ? null : `/api/v1/worker/${workerId}/getSchedule`,
    fetcher,
  );

  const schedule = !isDemo
    ? (Object.entries(data || []) as IScheduleArray)
    : (Object.entries(fakeSchedule) as IScheduleArray);

  return {
    data,
    error,
    isLoading,
    mutate,
    schedule,
  };
};
