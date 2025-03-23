//heroui components
import { TableCell, TableRow } from "@heroui/react";

// custom components
import { DateText } from "@/src/components/Date/DateText";
import { TypeRegisterChip } from "@/src/components/Chips/TypeRegisterChip";

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
