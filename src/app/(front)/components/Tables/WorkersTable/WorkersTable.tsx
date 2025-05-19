"use client";
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
import { ComponentError } from "../../ComponentError";
import { useWorkersByEstablishment } from "../../../hooks/worker/useWorkersByEstablishment";
import { IWorkerByEstablishment } from "../../../hooks/worker/worker.type";

export interface IWorkersTableProps {
  establishmentId: string;
  isWorkerEditable?: boolean;
  baseRoute: string;
  isDemo?: boolean;
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

const renderTableRows = ({
  workers,
  isWorkerEditable,
  baseRoute,
  isDemo = false,
}: {
  workers: IWorkerByEstablishment[];
  isWorkerEditable: boolean;
  baseRoute: string;
  isDemo?: boolean;
}) => {
  return workers.map(({ id, email, name, worker_clockin }) => (
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
          baseRoute={baseRoute}
          isDemo={isDemo}
        />
      </TableCell>
    </TableRow>
  ));
};

const fakeWorkersByEstablishment: IWorkerByEstablishment[] = [
  {
    id: "worker-001",
    name: "João Silva",
    email: "joao.silva@email.com",
    worker_clockin: [{ is_entry: false }],
  },
  {
    id: "worker-002",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    worker_clockin: [{ is_entry: true }],
  },
];
export const WorkersTable = ({
  establishmentId,
  isWorkerEditable = true,
  baseRoute,
  isDemo = false,
}: IWorkersTableProps) => {
  const { data, error, isLoading, mutate, page, setPage, totalPages } =
    useWorkersByEstablishment({
      establishmentId,
      isDemo,
    });
  if (error)
    return <ComponentError message={error.message} action={error.action} />;
  return (
    <Table
      isStriped
      aria-label="Example static collection table"
      topContent={
        <div className="flex justify-between items-center">
          <h1 className="text-xl">Funcionários</h1>
          <CreateWorkerModal
            isDemo={isDemo}
            establishmentId={establishmentId}
            onCreate={() => mutate()}
          />
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
              total={totalPages || 1}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      }
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
        loadingState={isLoading ? "loading" : "idle"}
      >
        {isDemo
          ? renderTableRows({
              workers: fakeWorkersByEstablishment,
              baseRoute,
              isWorkerEditable,
              isDemo: true,
            })
          : renderTableRows({
              workers: data?.workers || [],
              baseRoute,
              isWorkerEditable,
              isDemo: false,
            })}
      </TableBody>
    </Table>
  );
};
