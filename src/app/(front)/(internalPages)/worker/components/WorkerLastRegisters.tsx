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
import { IRegister } from "../../../components/Tables/RegistersTable/useTimeSheet";

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

const fakeRegisters: IClockin[] = [
  {
    id: "1234",
    clocked_at: new Date().toISOString(),
    is_entry: true,
    lat: 0,
    lng: 0,
    is_auto_generated: false,
    registered_by: "1234",
    worker_id: "1234",
  },
  {
    id: "1235",
    clocked_at: new Date().toISOString(),
    is_entry: false,
    lat: 0,
    lng: 0,
    is_auto_generated: false,
    registered_by: "1234",
    worker_id: "1234",
  },
];

const renderLastRegistersTableRows = ({
  registers,
}: {
  registers: IRegister[];
}) => {
  return registers.map(({ id, clocked_at, is_entry }) => {
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
          <HourText hour={date.getHours()} minute={date.getMinutes()} />
        </TableCell>
      </TableRow>
    );
  });
};
export const WorkerLastRegisters = ({
  isDemo = false,
}: {
  isDemo?: boolean;
}) => {
  const { data, isLoading, error } = useSWR<{ lastTwoRegisters: IClockin[] }>(
    isDemo ? null : "/api/v1/clockin/lastTwoRegisters",
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
            items={isDemo ? fakeRegisters : data?.lastTwoRegisters}
            emptyContent="Você ainda não possui registros"
          >
            {renderLastRegistersTableRows({
              registers: isDemo ? fakeRegisters : data?.lastTwoRegisters || [],
            })}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};
