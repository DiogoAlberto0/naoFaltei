"use client";

// heroui components
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Spinner } from "@heroui/react";

// custom components
import {
  TypeRegisterChip,
  TypeRegisterChipLegend,
} from "@/src/app/(front)/components/DataViews/Chips/TypeRegisterChip";
import { DateText } from "@/src/app/(front)/components/DataViews/Date/DateText";
import { ComponentError } from "../ComponentError";
import { RefreshIconButton } from "../Buttons/RefreshButton";

//fetcher
import { useClockinsByEstablishment } from "../../hooks/clockins/useClockinsByEstablishment";
import { IRegister } from "../../hooks/clockins/clockins.types";

const fakeRegisters: IRegister[] = [
  {
    id: "reg-001",
    clocked_at: "2025-05-19T08:30:00Z",
    is_entry: true,
    worker: {
      name: "João Silva",
      email: "joao.silva@example.com",
    },
  },
  {
    id: "reg-002",
    clocked_at: "2025-05-19T17:45:00Z",
    is_entry: false,
    worker: {
      name: "João Silva",
      email: "joao.silva@example.com",
    },
  },
  {
    id: "reg-003",
    clocked_at: "2025-05-19T09:00:00Z",
    is_entry: true,
    worker: {
      name: "Maria Oliveira",
      email: "maria.oliveira@example.com",
    },
  },
  {
    id: "reg-004",
    clocked_at: "2025-05-19T18:10:00Z",
    is_entry: false,
    worker: {
      name: "Maria Oliveira",
      email: "maria.oliveira@example.com",
    },
  },
];

const renderRegistersTableRows = ({
  registers,
}: {
  registers: IRegister[];
}) => {
  return registers.map(
    ({ id, worker: { name }, is_entry: clockIn, clocked_at }) => {
      const date = new Date(clocked_at);
      return (
        <TableRow
          key={id}
          className={`${clockIn ? "max-sm:bg-success-400 max-sm:bg-opacity-50" : "max-sm:bg-danger-400 max-sm:bg-opacity-50"}`}
        >
          <TableCell className="whitespace-nowrap">
            {name.split(" ")[0]} {name.split(" ")[1]}
          </TableCell>
          <TableCell className="max-sm:hidden">
            <TypeRegisterChip clockIn={clockIn} />
          </TableCell>
          <TableCell>
            <DateText
              date={date}
              isFullDate
              className="hidden sm:flex md:hidden lg:flex"
            />
            <DateText date={date} className="sm:hidden md:flex lg:hidden" />
          </TableCell>
          <TableCell>
            {date.getHours().toString().padStart(2, "0")}:
            {date.getMinutes().toString().padStart(2, "0")}
          </TableCell>
        </TableRow>
      );
    },
  );
};

export const LastRegistersByEstablishment = ({
  title,
  establishmentId,
  maxRegisters,
  isDemo = false,
}: {
  title: string;
  maxRegisters: number;
  detailed?: boolean;
  establishmentId: string;
  isDemo?: boolean;
}) => {
  const { data, error, isLoading, page, setPage, totalPages } =
    useClockinsByEstablishment({
      establishmentId,
      maxRegisters,
      isDemo,
    });

  if (error)
    return <ComponentError message={error.message} action={error.action} />;

  return (
    <Table
      topContent={
        <div className=" w-full flex justify-between items-center">
          <h1 className="text-xl">{title}</h1>
          <RefreshIconButton onPress={() => window.location.reload()} />
        </div>
      }
      bottomContent={
        <div className="flex flex-col w-full justify-center ">
          <TypeRegisterChipLegend />
          <div className="w-full flex justify-center items-center">
            <Pagination
              size="sm"
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={totalPages || 1}
              onChange={(value) => setPage(value)}
            />
          </div>
        </div>
      }
      isStriped
    >
      <TableHeader>
        <TableColumn>Funcionário</TableColumn>
        <TableColumn className="max-sm:hidden">Tipo</TableColumn>
        <TableColumn>Data</TableColumn>
        <TableColumn>Hora</TableColumn>
      </TableHeader>
      <TableBody
        className="bg-blue-500"
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : "idle"}
        emptyContent="Ainda não há registros..."
      >
        {isDemo
          ? renderRegistersTableRows({ registers: fakeRegisters })
          : renderRegistersTableRows({ registers: data?.lastRegisters || [] })}
      </TableBody>
    </Table>
  );
};
