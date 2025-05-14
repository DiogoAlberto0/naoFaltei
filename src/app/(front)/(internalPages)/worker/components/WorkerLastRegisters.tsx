"use client";
import { TypeRegisterChip } from "@/src/app/(front)/components/DataViews/Chips/TypeRegisterChip";
import { DateText } from "@/src/app/(front)/components/DataViews/Date/DateText";
import { fetcher } from "@/src/utils/fetcher";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import useSWR from "swr";
import { ComponentError } from "../../../components/ComponentError";
import { HourText } from "../../../components/DataViews/Date/HourText";

interface IClockin {
  id: string;
  clocked_at: string;
  is_entry: boolean;
  lat: number;
  lng: number;
  is_auto_generated: boolean;
  registered_by: string;
  worker_id: string;
}
export const WorkerLastRegisters = () => {
  const { data, isLoading, error } = useSWR<{ lastTwoRegisters: IClockin[] }>(
    "/api/v1/clockin/lastTwoRegisters",
    fetcher,
  );

  if (error)
    return <ComponentError message={error.message} action={error.action} />;

  return (
    <Popover showArrow offset={10} placement="bottom">
      <PopoverTrigger>
        <Button color="secondary">Últimos registros</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Table
          aria-label="Last two registers of worker: XXX"
          color="secondary"
          className="text-2xl"
        >
          <TableHeader className="text-[0.1rem]">
            <TableColumn>Data</TableColumn>
            <TableColumn>Tipo</TableColumn>
            <TableColumn>Hora</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={data?.lastTwoRegisters}
            emptyContent="Você ainda não possui registros"
          >
            {data?.lastTwoRegisters.map(({ id, clocked_at, is_entry }) => {
              const date = new Date(clocked_at);
              return (
                <TableRow key={id}>
                  <TableCell>
                    <DateText
                      date={date}
                      isFullDay={true}
                      isFullMonth={true}
                      isFullYear={true}
                      className="max-sm:hidden"
                    />
                    <DateText date={date} className="sm:hidden" />
                  </TableCell>
                  <TableCell>
                    <TypeRegisterChip clockIn={is_entry} />
                  </TableCell>
                  <TableCell>
                    <HourText
                      hour={date.getHours()}
                      minute={date.getMinutes()}
                    />
                  </TableCell>
                </TableRow>
              );
            }) || []}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};
