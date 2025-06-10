"use client";
//fetcher

// heroui
import {
  Card,
  CardHeader,
  CardBody,
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
import { SetScheduleModal } from "./subComponents/SetScheduleModal";

// utils
import { dateUtils, weekDays } from "@/src/utils/date";

// hooks
import { useScheduleByWorker } from "../../../hooks/schedule/useScheduleByWorker";

export const WorkSchedule = ({
  workerId,
  isDemo = false,
}: {
  workerId: string;
  isDemo?: boolean;
}) => {
  const { error, isLoading, mutate, schedule } = useScheduleByWorker({
    workerId,
    isDemo,
  });

  if (error)
    return <ComponentError message={"Falha ao carregar escala de trabalho"} />;

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <h1 className="text-xl font-semibold">Escala de trabalho</h1>
        <SetScheduleModal
          isDemo={isDemo}
          workerId={workerId}
          prevSchedule={schedule}
          updateSchedule={() => mutate()}
        />
      </CardHeader>
      <CardBody>
        {isLoading && <Spinner />}
        {schedule === null && <h2>O funcionário não possui uma escala fixa</h2>}
        {schedule?.type === "week" && (
          <Table>
            <TableHeader>
              <TableColumn>Horas por semana</TableColumn>
              <TableColumn>Folgas</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>
                  {dateUtils.transformMinutesInTime(schedule.week_minutes, {
                    variant: "letter",
                  })}
                </TableCell>
                <TableCell>
                  {schedule.daysOff
                    .map((day) =>
                      dateUtils.translateWeekDayFromEnglishToPT(day),
                    )
                    .join(", ")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {schedule?.type === "day" && (
          <Table>
            <TableHeader>
              <TableColumn>Dia da semana</TableColumn>
              <TableColumn>Horas trabalhadas</TableColumn>
            </TableHeader>
            <TableBody items={Object.entries(schedule.daily_minutes)}>
              {([key, value]) => (
                <TableRow key={key}>
                  <TableCell>
                    {dateUtils.translateWeekDayFromEnglishToPT(key as weekDays)}
                  </TableCell>
                  <TableCell>
                    {schedule.daysOff.includes(key as weekDays)
                      ? "Folga"
                      : dateUtils.transformMinutesInTime(value, {
                          variant: "letter",
                        })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};
