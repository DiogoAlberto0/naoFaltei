"use client";
// heroui components
import { Pagination } from "@heroui/pagination";
import { Table, TableBody, TableColumn, TableHeader } from "@heroui/table";

// custom components
import { TopContentRegistersTable } from "@/src/app/(front)/components/RegistersTable/TopContent";
import { Spinner } from "@heroui/react";
import { ComponentError } from "../ComponentError";
import { useTimeSheet } from "./useTimeSheet";
import { renderTableRows } from "./TableRows";
import { useState } from "react";

export const RegistersTable = ({
  overflowAuto = true,
  workerId,
}: {
  maxRegisters: number;
  detailed?: boolean;
  overflowAuto?: boolean;
  workerId: string;
}) => {
  const { title, error, data, isLoading } = useTimeSheet(workerId);

  const timeSheet = data?.timeSheet || [];
  const maxPerPage = 5;
  const [page, setPage] = useState(1);

  if (error)
    return <ComponentError message={error.message} action={error.action} />;
  return (
    <Table
      isStriped
      topContent={
        <TopContentRegistersTable
          title={title}
          detailed={!!data}
          timeSheet={timeSheet}
          absenceDays={data?.totalAbscent}
          hoursBank={data?.totalTimeBalance}
          medicalCertificateDays={data?.totalMedicalLeave}
        />
      }
      classNames={
        overflowAuto
          ? {
              base: "h-full w-full max-w-full overflow-auto",
              wrapper: "grow flex flex-col items-start",
              table: "flex-1",
            }
          : {}
      }
      bottomContent={
        <div className="w-full flex justify-center items-center">
          <Pagination
            size="sm"
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={Math.ceil(timeSheet.length / maxPerPage) || 1}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Data</TableColumn>
        <TableColumn>Entrada</TableColumn>
        <TableColumn>Saída</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"Não há registros nesse intervalo de datas"}
        items={timeSheet}
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {renderTableRows(
          timeSheet.slice(
            (page - 1) * maxPerPage,
            (page - 1) * maxPerPage + maxPerPage,
          ),
        )}
      </TableBody>
    </Table>
  );
};
