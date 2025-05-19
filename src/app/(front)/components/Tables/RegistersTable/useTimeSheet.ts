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

const fakeTimeSheet: ITimeSheet = {
  timeSheet: [
    {
      id: "day-1",
      work_date: "2025-05-15T08:00:00.000Z",
      expected_minutes: 480,
      worked_minutes: 450,
      rested_minutes: 60,
      time_balance: -30,
      is_medical_leave: false,
      status: "present",
      worker_id: "worker-123",
      registers: [
        {
          id: "reg-1",
          clocked_at: "2025-05-15T08:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: true,
          registered_by: "system",
        },
        {
          id: "reg-2",
          clocked_at: "2025-05-15T12:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: false,
          registered_by: "system",
        },
        {
          id: "reg-3",
          clocked_at: "2025-05-15T13:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: true,
          registered_by: "system",
        },
        {
          id: "reg-4",
          clocked_at: "2025-05-15T17:30:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: false,
          registered_by: "manager-1",
        },
      ],
    },
    {
      id: "day-2",
      work_date: "2025-05-16T08:00:00.000Z",
      expected_minutes: 480,
      worked_minutes: 480,
      rested_minutes: 60,
      time_balance: 0,
      is_medical_leave: false,
      status: "present",
      worker_id: "worker-123",
      registers: [
        {
          id: "reg-5",
          clocked_at: "2025-05-16T08:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: true,
          registered_by: "system",
        },
        {
          id: "reg-6",
          clocked_at: "2025-05-16T12:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: false,
          registered_by: "system",
        },
        {
          id: "reg-7",
          clocked_at: "2025-05-16T13:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: true,
          registered_by: "system",
        },
        {
          id: "reg-8",
          clocked_at: "2025-05-16T17:00:00.000Z",
          lat: -23.55052,
          lng: -46.63331,
          worker_id: "worker-123",
          is_entry: false,
          registered_by: "system",
        },
      ],
    },
    {
      id: "day-3",
      work_date: "2025-05-17T08:00:00.000Z",
      expected_minutes: 480,
      worked_minutes: 0,
      rested_minutes: 0,
      time_balance: -480,
      is_medical_leave: false,
      status: "abscent",
      worker_id: "worker-123",
      registers: [],
    },
    {
      id: "day-4",
      work_date: "2025-05-18T08:00:00.000Z",
      expected_minutes: 480,
      worked_minutes: 0,
      rested_minutes: 0,
      time_balance: 0,
      is_medical_leave: true,
      status: "present",
      worker_id: "worker-123",
      registers: [],
    },
  ],
  totalAbscent: 1,
  totalMedicalLeave: 1,
  totalTimeBalance: -510,
};

export const useTimeSheet = (workerId: string, isDemo: boolean = false) => {
  const searchParams = useSearchParams();

  const inicialDateString = searchParams.get("inicialDate");
  const endDateString = searchParams.get("endDate");

  const { data, error, isLoading } = useSWR<ITimeSheet>(
    isDemo
      ? null
      : `/api/v1/clockin/timeSheet/${workerId}?inicialDate=${inicialDateString}&finalDate=${endDateString}`,
    fetcher,
  );

  if (isDemo) {
    return {
      title: `${new Date("2025-05-15T08:00:00.000Z").toLocaleDateString()} - ${new Date("2025-05-18T08:00:00.000Z").toLocaleDateString()}`,
      data: fakeTimeSheet,
      error: undefined,
      isLoading: false,
    };
  }
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
