"use client";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

export const LastRegistersTable = () => {
  const registers = [0, 1, 2, 3, 4, 5, 6];
  return (
    <Table
      topContent={
        <div>
          <h1 className="text-xl">Últimos registros</h1>
        </div>
      }
      classNames={{
        base: "h-full w-full",
        wrapper: "grow flex flex-col items-start",
        table: "flex-1",
      }}
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
    >
      <TableHeader>
        <TableColumn>Funcionário</TableColumn>
        <TableColumn>Tipo</TableColumn>
        <TableColumn>Data</TableColumn>
        <TableColumn>Hora</TableColumn>
      </TableHeader>
      <TableBody className="bg-blue-500">
        <>
          {registers.map((id) => (
            <TableRow key={id}>
              <TableCell>Diogo alberto</TableCell>
              <TableCell>
                <Chip variant="flat" color="success">
                  Entrada
                </Chip>
              </TableCell>
              <TableCell>15/03/25</TableCell>
              <TableCell>10:30</TableCell>
            </TableRow>
          ))}
        </>
      </TableBody>
    </Table>
  );
};
