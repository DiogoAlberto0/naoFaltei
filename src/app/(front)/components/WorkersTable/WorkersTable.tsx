"use client";
// next
import useSWR from "swr";
import { useState } from "react";

//heroui components
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/react";

// Custom components
import { CreateWorkerModal } from "./CreateWorkerModal";
import { StatusChip } from "./WorkerStatusChip";
import { ActionsToolTips } from "./WorkerActions";

//fetcher
import { fetcher } from "@/src/utils/fetcher";

interface IWorker {
  id: string;
  name: string;
  email: string;
  worker_clockin: {
    is_entry: boolean;
  }[];
}
interface IMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface IWorkersTableProps {
  establishmentId: string;
  isWorkerEditable?: boolean;
}

const Legend = () => {
  return (
    <div className="block sm:hidden">
      <h2 className="text-sm">Legenda:</h2>
      <StatusChip isWorking></StatusChip>
      <StatusChip isWorking={false}></StatusChip>
    </div>
  );
};
export const WorkersTable = ({
  establishmentId,
  isWorkerEditable = true,
}: IWorkersTableProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR<{
    workers: IWorker[];
    meta: IMeta;
  }>(
    `/api/v1/worker/list?establishmentId=${establishmentId}&page=${page}&pageSize=${7}`,
    fetcher,
  );

  const loadingState = isLoading ? "loading" : "idle";
  console.log(data);
  return (
    <Table
      isStriped
      aria-label="Example static collection table"
      topContent={
        <div className="flex justify-between items-center">
          <h1 className="text-xl">Funcionários</h1>
          <CreateWorkerModal establishmentId={establishmentId} />
        </div>
      }
      bottomContent={
        <div className="flex flex-col w-full justify-center ">
          <Legend />
          <div className="w-full flex justify-center items-center">
            <Pagination
              size="sm"
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={data?.meta.totalPages || 1}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      }
      classNames={{
        base: "h-full",
        wrapper: "flex-1",
        table: "h-full",
        tbody: "",
      }}
    >
      <TableHeader>
        <TableColumn>Funcionário</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Ações</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"Essa empresa ainda não possui funcionário"}
        items={data?.workers ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        <>
          {data?.workers.map(({ id, email, name, worker_clockin }) => (
            <TableRow key={id}>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-bold text-sm capitalize">{name}</p>
                  <p className="text-bold text-sm capitalize text-default-400">
                    {email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <StatusChip
                  responsive
                  isWorking={worker_clockin[0]?.is_entry || false}
                />
              </TableCell>
              <TableCell>
                <ActionsToolTips
                  workerId={id}
                  isWorkerEditable={isWorkerEditable}
                />
              </TableCell>
            </TableRow>
          ))}
        </>
      </TableBody>
    </Table>
  );
};
