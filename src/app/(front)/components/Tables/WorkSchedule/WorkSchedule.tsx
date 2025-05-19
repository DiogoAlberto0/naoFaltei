"use client";
//fetcher

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

// hooks
import { useScheduleByWorker } from "../../../hooks/schedule/useScheduleByWorker";

const days = {
  sunday: "Dom.",
  monday: "Seg.",
  tuesday: "Ter.",
  wednesday: "Qua.",
  thursday: "Qui.",
  friday: "Sex.",
  saturday: "Sab.",
};

export const WorkSchedule = ({
  workerId,
  isDemo = false,
}: {
  workerId: string;
  isDemo?: boolean;
}) => {
  const { data, error, isLoading, mutate, schedule } = useScheduleByWorker({
    workerId,
    isDemo,
  });

  if (error)
    return <ComponentError message={"Falha ao carregar escala de trabalho"} />;

  return (
    <Table
      topContent={
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Escala de trabalho:</h1>
          <SetScheduleModal
            isDemo={isDemo}
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
        {schedule.map(([key, value]) => {
          // Horário UTC convertido para local, pois o backend retorna UTC

          const { hour: startHour, minute: startMinute } =
            dateUtils.convertTimeFromUTCtoLocale({
              hour: value.startHour,
              minute: value.startMinute,
            });

          const { hour: endHour, minute: endMinute } =
            dateUtils.convertTimeFromUTCtoLocale({
              hour: value.endHour,
              minute: value.endMinute,
            });

          return (
            <TableRow key={key}>
              <TableCell>{days[key]}</TableCell>
              <TableCell>
                {value.isDayOff
                  ? "--:--"
                  : dateUtils.formatTime(startHour, startMinute)}
              </TableCell>
              <TableCell>
                {value.isDayOff
                  ? "--:--"
                  : dateUtils.formatTime(endHour, endMinute)}
              </TableCell>
              <TableCell>
                {value.isDayOff ? "--" : value.restTimeInMinutes}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
