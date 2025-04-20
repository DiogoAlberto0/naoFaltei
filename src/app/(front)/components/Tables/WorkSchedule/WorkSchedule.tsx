"use client";
//fetcher
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";

// heroui
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
// components
import { ComponentError } from "../../ComponentError";
import { SetScheduleModal } from "./SetScheduleModal";

// utils
import { dateUtils } from "@/src/utils/date";

export interface IDaySchedule {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  restTimeInMinutes: number;
  isDayOff: boolean;
}
export interface ISchedule {
  sunday: IDaySchedule;
  monday: IDaySchedule;
  tuesday: IDaySchedule;
  wednesday: IDaySchedule;
  thursday: IDaySchedule;
  friday: IDaySchedule;
  saturday: IDaySchedule;
}

const days = {
  sunday: "Dom.",
  monday: "Seg.",
  tuesday: "Ter.",
  wednesday: "Qua.",
  thursday: "Qui.",
  friday: "Sex.",
  saturday: "Sab.",
};

export const WorkSchedule = ({ workerId }: { workerId: string }) => {
  const { data, error, isLoading, mutate } = useSWR<ISchedule>(
    `/api/v1/worker/${workerId}/getSchedule`,
    fetcher,
  );

  const schedule = data
    ? (Object.entries(data) as [keyof ISchedule, IDaySchedule][])
    : [];

  if (error)
    return <ComponentError message={"Falha ao carregar escala de trabalho"} />;

  return (
    <Table
      topContent={
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Escala de trabalho:</h1>
          <SetScheduleModal
            workerId={workerId}
            prevSchedule={data}
            updateSchedule={() => mutate()}
          />
        </div>
      }
      aria-label="Tabela informando a escala de trabalho do funcionário"
    >
      <TableHeader aria-label="Example static collection table">
        <TableColumn>Dia</TableColumn>
        <TableColumn>Entrada</TableColumn>
        <TableColumn>Saída</TableColumn>
        <TableColumn>Descanso (min.)</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={schedule}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="Escala de trabalho ainda não foi definida"
      >
        {schedule.map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{days[key]}</TableCell>
            <TableCell>
              {value.isDayOff
                ? "--:--"
                : dateUtils.formatTime(value.startHour, value.startMinute)}
            </TableCell>
            <TableCell>
              {value.isDayOff
                ? "--:--"
                : dateUtils.formatTime(value.endHour, value.endMinute)}
            </TableCell>
            <TableCell>
              {value.isDayOff ? "--" : value.restTimeInMinutes}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
