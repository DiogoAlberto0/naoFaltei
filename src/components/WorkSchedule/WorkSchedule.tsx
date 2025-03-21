"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export const WorkSchedule = () => {
  return (
    <Table isCompact>
      <TableHeader aria-label="Example static collection table">
        <TableColumn>Dia</TableColumn>
        <TableColumn>Entrada</TableColumn>
        <TableColumn>Saída</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key={0}>
          <TableCell>Seg.</TableCell>
          <TableCell>10:30</TableCell>
          <TableCell>20:00</TableCell>
        </TableRow>
        <TableRow key={1}>
          <TableCell>Ter.</TableCell>
          <TableCell>10:30</TableCell>
          <TableCell>20:00</TableCell>
        </TableRow>
        <TableRow key={2}>
          <TableCell>Qua.</TableCell>
          <TableCell>10:30</TableCell>
          <TableCell>20:00</TableCell>
        </TableRow>
        <TableRow key={3}>
          <TableCell>Qui.</TableCell>
          <TableCell>10:30</TableCell>
          <TableCell>20:00</TableCell>
        </TableRow>
        <TableRow key={4}>
          <TableCell>Sex.</TableCell>
          <TableCell>10:30</TableCell>
          <TableCell>20:00</TableCell>
        </TableRow>
        <TableRow key={5}>
          <TableCell>Sab.</TableCell>
          <TableCell>08:00</TableCell>
          <TableCell>12:00</TableCell>
        </TableRow>
        <TableRow key={6}>
          <TableCell>Dom.</TableCell>
          <TableCell>Folga</TableCell>
          <TableCell>Folga</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
