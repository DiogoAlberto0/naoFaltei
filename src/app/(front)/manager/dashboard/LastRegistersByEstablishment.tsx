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

// custom components
import {
  TypeRegisterChip,
  TypeRegisterChipLegend,
} from "@/src/app/(front)/components/Chips/TypeRegisterChip";
import { DateText } from "@/src/app/(front)/components/Date/DateText";

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
        {hour}:{minute}
      </TableCell>
    </TableRow>
  );
};

export const LastRegistersByEstablishment = ({
  title,
  maxRegisters,
}: {
  title: string;
  maxRegisters: number;
  detailed?: boolean;
}) => {
  const registers = [];

  for (let index = 0; index < maxRegisters; index++) {
    registers.push(index);
  }

  const names = [
    "Lucas Andrade Costa",
    "Mariana Silva Ferreira",
    "Ricardo Oliveira Santos",
    "Beatriz Rocha Almeida",
    "Fernando Martins Correia",
    "Juliana Mendes Souza",
    "Gabriel Lima Fonseca",
    "Lucas Andrade Costa",
    "Mariana Silva Ferreira",
    "Ricardo Oliveira Santos",
    "Beatriz Rocha Almeida",
    "Fernando Martins Correia",
    "Juliana Mendes Souza",
    "Gabriel Lima Fonseca",
  ];
  const tableRows = registers.map((id, index) =>
    renderRegitersTableRow({
      id: id.toString(),
      name: names[index],
      clockIn: id % 2 == 0,
      date: new Date(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    }),
  );
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
