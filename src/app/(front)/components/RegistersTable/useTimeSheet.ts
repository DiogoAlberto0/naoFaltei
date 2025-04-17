import { fetcher } from "@/src/utils/fetcher";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export interface IRegister {
  id: string;
  clocked_at: string;
  lat: number;
  lng: number;
  worker_id: string;
  is_entry: boolean;
  registered_by: string;
}

export interface IDaySummary {
  id: string;
  work_date: string;
  expected_minutes: number;
  worked_minutes: number;
  rested_minutes: number;
  time_balance: number;
  is_medical_leave: boolean;
  status: string;
  worker_id: string;
  registers: IRegister[];
}

export interface ITimeSheet {
  timeSheet: IDaySummary[];
  totalAbscent: number;
  totalMedicalLeave: number;
  totalTimeBalance: number;
}
export const useTimeSheet = (workerId: string) => {
  const searchParams = useSearchParams();

  const inicialDateString = searchParams.get("inicialDate");
  const endDateString = searchParams.get("endDate");

  const { data, error, isLoading } = useSWR<ITimeSheet>(
    `/api/v1/clockin/timeSheet/${workerId}?inicialDate=${inicialDateString}&finalDate=${endDateString}`,
    fetcher,
  );

  if (!inicialDateString || !endDateString)
    return {
      title: "Selecione uma data para busca",
      data: undefined,
      error: undefined,
      isLoading: false,
    };

  const inicialDate = new Date(inicialDateString);
  inicialDate.setUTCHours(12, 0, 0, 0);
  const endDate = new Date(endDateString);
  endDate.setUTCHours(12, 0, 0, 0);

  return {
    title: `${inicialDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    data,
    error,
    isLoading,
  };
};
