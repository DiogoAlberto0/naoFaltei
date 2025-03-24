"use client";
import { TypeRegisterChip } from "@/src/components/Chips/TypeRegisterChip";
import { DateText } from "@/src/components/Date/DateText";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export const WorkerLastRegisters = () => {
  const lastRegisters = [
    {
      id: "1",
      clockIn: true,
      date: new Date(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    },
    {
      id: "2",
      clockIn: false,
      date: new Date(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    },
  ];

  return (
    <Popover showArrow offset={10} placement="bottom">
      <PopoverTrigger>
        <Button color="secondary">Ùltimos registros</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Table
          aria-label="Last two registers of worker: XXX"
          color="secondary"
          className="text-2xl"
        >
          <TableHeader className="text-[0.1rem]">
            <TableColumn>Data</TableColumn>
            <TableColumn>Tipo</TableColumn>
            <TableColumn>Hora</TableColumn>
          </TableHeader>
          <TableBody>
            {lastRegisters.map(({ id, date, clockIn, hour, minute }) => (
              <TableRow key={id}>
                <TableCell>
                  <DateText
                    date={date}
                    isFullDay={true}
                    isFullMonth={true}
                    isFullYear={true}
                    className="max-sm:hidden"
                  />
                  <DateText date={date} className="sm:hidden" />
                </TableCell>
                <TableCell>
                  <TypeRegisterChip clockIn={clockIn} />
                </TableCell>
                <TableCell>
                  {hour.toString().padStart(2, "0")}:
                  {minute.toString().padStart(2, "0")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};
