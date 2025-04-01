"use client";
// heroui components
import { Pagination } from "@heroui/pagination";
import { Table, TableBody, TableColumn, TableHeader } from "@heroui/table";

// custom components
import { TopContentRegistersTable } from "@/src/app/(front)/components/RegistersTable/TopContent";
import { renderRegitersTableRow } from "@/src/app/(front)/components/RegistersTable/Row";

export const RegistersTable = ({
  title,
  maxRegisters,
  detailed = true,
  overflowAuto = true,
}: {
  title: string;
  maxRegisters: number;
  detailed?: boolean;
  overflowAuto?: boolean;
}) => {
  const registers = [];

  for (let index = 0; index < maxRegisters; index++) {
    registers.push(index);
  }

  const tableRows = registers.map((id) => {
    const clockinDate = new Date();
    const clockOutDate = new Date();
    clockOutDate.setHours(clockinDate.getHours() + 1);
    return renderRegitersTableRow({
      id: id.toString(),
      clockIn: {
        hour: clockinDate.getHours(),
        minute: clockinDate.getMinutes(),
      },
      clockOut: {
        hour: clockOutDate.getHours(),
        minute: clockOutDate.getMinutes(),
      },
      date: new Date(),
    });
  });
  return (
    <Table
      isStriped
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
            page={1}
            total={10}
            onChange={(page) => console.log(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Data</TableColumn>
        <TableColumn>Entrada</TableColumn>
        <TableColumn>Saída</TableColumn>
      </TableHeader>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
};
