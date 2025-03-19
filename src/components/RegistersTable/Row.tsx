import { Chip, TableCell, TableRow } from "@heroui/react";

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
    <TableRow key={id}>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Chip variant="flat" color={clockIn ? "success" : "danger"}>
          {clockIn ? "Entrada" : "Saída"}
        </Chip>
      </TableCell>
      <TableCell>{date.toLocaleDateString()}</TableCell>
      <TableCell>
        {hour}:{minute}
      </TableCell>
    </TableRow>
  );
};
