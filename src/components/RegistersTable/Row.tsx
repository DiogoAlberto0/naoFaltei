import { Chip, TableCell, TableRow } from "@heroui/react";
import { DateText } from "../Date/DateText";

export const TypeRegisterChip = ({ clockIn }: { clockIn: boolean }) => {
  return (
    <Chip variant="flat" color={clockIn ? "success" : "danger"}>
      {clockIn ? "Entrada" : "Saída"}
    </Chip>
  );
};

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
      <TableCell>{name}</TableCell>
      <TableCell className="max-sm:hidden">
        <TypeRegisterChip clockIn={clockIn} />
      </TableCell>
      <TableCell>
        <DateText
          date={date}
          isFullYear
          isFullDay
          isFullMonth
          className="max-sm:hidden"
        />
        <DateText date={date} className="sm:hidden" />
      </TableCell>
      <TableCell>
        {hour}:{minute}
      </TableCell>
    </TableRow>
  );
};
