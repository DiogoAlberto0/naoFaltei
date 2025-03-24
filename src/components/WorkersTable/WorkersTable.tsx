"use client";
// next

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

// Custom components
import { WorkerModal } from "./WorkerModal";
import { StatusChip } from "./WorkerStatusChip";
import { ActionsToolTips } from "./WorkerActions";

const workers = [
  {
    id: "1",
    name: "Diogo Alberto",
    email: "dafgo03@gmail.com",
    isWorking: true,
  },
  { id: "2", name: "João Silva", email: "joao@email.com", isWorking: false },
  { id: "3", name: "Maria Souza", email: "maria@email.com", isWorking: true },
  {
    id: "4",
    name: "Diogo Alberto",
    email: "dafgo03@gmail.com",
    isWorking: true,
  },
  { id: "5", name: "João Silva", email: "joao@email.com", isWorking: false },
  { id: "6", name: "Maria Souza", email: "maria@email.com", isWorking: true },
];

export interface IWorkersTableProps {
  establishmentId: string;
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
export const WorkersTable = ({ establishmentId }: IWorkersTableProps) => {
  return (
    <>
      <Table
        aria-label="Example static collection table"
        topContent={
          <div className="flex justify-between items-center">
            <h1 className="text-xl">Funcionários</h1>
            <WorkerModal establishmentId={establishmentId} type="create" />
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
                page={1}
                total={10}
                onChange={(page) => console.log(page)}
              />
            </div>
          </div>
        }
        classNames={{
          base: "h-full w-full overflow-auto", // Ocupa 100% da altura e largura disponíveis
          wrapper: "grow flex flex-col", // Permite que o wrapper cresça para preencher o espaço
          table: "flex-1 ", // Faz a tabela ocupar o espaço disponível
        }}
      >
        <TableHeader>
          <TableColumn>Funcionário</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Ações</TableColumn>
        </TableHeader>
        <TableBody>
          <>
            {workers.map(({ id, email, name, isWorking }) => (
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
                  <StatusChip responsive isWorking={isWorking} />
                </TableCell>
                <TableCell>
                  <ActionsToolTips workerId={id} />
                </TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
    </>
  );
};
