"use client";
//next
import { useEffect, useState } from "react";
import useSWR from "swr";
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

//fetcher
import { fetcher } from "@/src/utils/fetcher";

interface IRegister {
  id: string;
  clocked_at: string;
  is_entry: boolean;
  worker: {
    name: string;
    email: string;
  };
}

interface IMetaInfos {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

interface IListClockinResponse {
  lastRegisters: IRegister[];
  meta: IMetaInfos;
}
export const renderRegitersTableRow = ({
  id,
  name,
  clockIn,
  date,
  hour,
  minute,
}: {
  id: string;
  name: string;
  clockIn: boolean;
  date: Date;
  hour: number;
  minute: number;
}) => {
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
        {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}
      </TableCell>
    </TableRow>
  );
};

const renderRegistersTableRows = ({
  registers,
}: {
  registers: IRegister[];
}) => {
  return registers.map(
    ({ id, worker: { name }, is_entry: clockIn, clocked_at }) => {
      const date = new Date(clocked_at);
      return renderRegitersTableRow({
        id,
        name,
        clockIn,
        date: date,
        hour: date.getHours(),
        minute: date.getMinutes(),
      });
    },
  );
};

export const LastRegistersByEstablishment = ({
  title,
  establishmentId,
  maxRegisters,
}: {
  title: string;
  maxRegisters: number;
  detailed?: boolean;
  establishmentId: string;
}) => {
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState<number | null>(null);

  const { data, error, isLoading } = useSWR<IListClockinResponse>(
    `/api/v1/clockin/listByEstablishment?establishmentId=${establishmentId}&pageSize=${maxRegisters}&page=${page}`,
    fetcher,
  );

  useEffect(() => {
    if (data?.meta.totalPages && totalPages === null) {
      setTotalPages(data.meta.totalPages);
    }
  }, [data, totalPages]);

  if (error)
    return <ComponentError message={error.message} action={error.action} />;
  return (
    <Table
      topContent={
        <div className=" w-full flex justify-between items-center">
          <h1 className="text-xl">{title}</h1>
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
        {renderRegistersTableRows({ registers: data?.lastRegisters || [] })}
      </TableBody>
    </Table>
  );
};
