import { fetcher } from "@/src/utils/fetcher";
import useSWR from "swr";
import { ISchedule } from "./schedule.types";

const fakeSchedule: ISchedule = {
  type: "day",
  daily_minutes: {
    monday: 480,
    tuesday: 480,
    wednesday: 480,
    thursday: 480,
    friday: 480,
    saturday: 480,
    sunday: 0,
  },
  daysOff: ["sunday"],
};

export const useScheduleByWorker = ({
  workerId,
  isDemo = false,
}: {
  workerId: string;
  isDemo?: boolean;
}) => {
  const { data, error, isLoading, mutate } = useSWR<ISchedule>(
    isDemo ? null : `/api/v2/worker/${workerId}/getSchedule`,
    fetcher,
  );

  const schedule = !isDemo ? (data as ISchedule) : (fakeSchedule as ISchedule);

  console.log(data);
  return {
    data,
    error,
    isLoading,
    mutate,
    schedule,
  };
};
