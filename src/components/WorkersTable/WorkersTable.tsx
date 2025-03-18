"use client";
// next
import { redirect } from "next/navigation";
//heroui components
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

//Icons
import { AddIcon } from "@/assets/icons/AddIcon";
import { DeleteIcon } from "@/assets/icons/DeleteIcon";
import { EditIcon } from "@/assets/icons/EditIcon";
import { EyeIcon } from "@/assets/icons/EyeIcon";
import { useDisclosure } from "@heroui/modal";
import { CreateWorkerModal } from "./CreateWorkerModal";

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

const StatusChip = ({ isWorking }: { isWorking: boolean }) => (
  <Chip
    className="capitalize border-none gap-1 text-default-600"
    color={isWorking ? "success" : "danger"}
    size="sm"
    variant="dot"
  >
    {isWorking ? "Trabalhando" : "Ausente"}
  </Chip>
);

const ActionsToolTips = ({ workerId }: { workerId: string }) => (
  <div className="relative flex items-center gap-2">
    <Tooltip content="Details">
      <span
        onClick={() => redirect(`/manager/worker/${workerId}`)}
        className="text-lg text-default-400 cursor-pointer active:opacity-50"
      >
        <EyeIcon />
      </span>
    </Tooltip>
    <Tooltip content="Edit user">
      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
        <EditIcon />
      </span>
    </Tooltip>
    <Tooltip color="danger" content="Delete user">
      <span className="text-lg text-danger cursor-pointer active:opacity-50">
        <DeleteIcon />
      </span>
    </Tooltip>
  </div>
);

export interface IWorkersTableProps {
  establishmentId: string;
}
export const WorkersTable = ({ establishmentId }: IWorkersTableProps) => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure();
  return (
    <>
      <Table
        aria-label="Example static collection table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={1}
              total={10}
              onChange={(page) => console.log(page)}
            />
          </div>
        }
        classNames={{
          base: "h-full w-full", // Ocupa 100% da altura e largura disponíveis
          wrapper: "grow flex flex-col", // Permite que o wrapper cresça para preencher o espaço
          table: "flex-1", // Faz a tabela ocupar o espaço disponível
        }}
        topContent={
          <div className="flex justify-between items-center">
            <h1 className="text-xl">Funcionários</h1>
            <Button
              size="sm"
              isIconOnly
              aria-label="Take a photo"
              color="success"
              onPress={onOpen}
            >
              <AddIcon className="stroke-current h-5 w-5" />
            </Button>
          </div>
        }
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
                  <StatusChip isWorking={isWorking} />
                </TableCell>
                <TableCell>
                  <ActionsToolTips workerId={id} />
                </TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
      <CreateWorkerModal
        establishmentId={establishmentId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
