"use client";
// heroui components
import { Pagination } from "@heroui/pagination";
import { Table, TableBody, TableColumn, TableHeader } from "@heroui/table";

// custom components
import { TopContentRegistersTable } from "./TopContent";
import { renderRegitersTableRow, TypeRegisterChip } from "./Row";

const Legend = () => {
  return (
    <div className="block sm:hidden">
      <h2 className="text-sm">Legenda:</h2>
      <TypeRegisterChip clockIn />
      <TypeRegisterChip clockIn={false} />
    </div>
  );
};
export const RegistersTable = ({
  title,
  maxRegisters,
  detailed = true,
}: {
  title: string;
  maxRegisters: number;
  detailed?: boolean;
}) => {
  const registers = [];

  for (let index = 0; index < maxRegisters; index++) {
    registers.push(index);
  }

  const tableRows = registers.map((id) =>
    renderRegitersTableRow({
      id: id.toString(),
      name: "Diogo Alberto",
      clockIn: id % 2 == 0,
      date: new Date(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    }),
  );
  return (
    <Table
      topContent={
        <TopContentRegistersTable
          title={title}
          detailed={detailed}
          absenceDays={1}
          hoursBank={2}
          medicalCertificateDays={3}
          tardinessDays={4}
        />
      }
      classNames={{
        base: "h-full w-full max-w-full overflow-auto",
        wrapper: "grow flex flex-col items-start",
        table: "flex-1",
      }}
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
    >
      <TableHeader>
        <TableColumn>Funcionário</TableColumn>
        <TableColumn className="max-sm:hidden">Tipo</TableColumn>
        <TableColumn>Data</TableColumn>
        <TableColumn>Hora</TableColumn>
      </TableHeader>
      <TableBody className="bg-blue-500">{tableRows}</TableBody>
    </Table>
  );
};
