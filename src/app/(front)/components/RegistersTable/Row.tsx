//heroui components
import { TableCell, TableRow } from "@heroui/react";

// custom components
import { DateText } from "@/src/app/(front)/components/Date/DateText";
import { HourText } from "../Date/HourText";

export const renderRegitersTableRow = ({
  id,
  clockIn,
  clockOut,
  date,
}: {
  id: string;
  clockIn: {
    hour: number;
    minute: number;
  };
  clockOut: {
    hour: number;
    minute: number;
  };
  date: Date;
}) => {
  return (
    <TableRow key={id}>
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
        <HourText hour={clockIn.hour} minute={clockIn.minute} />
      </TableCell>
      <TableCell>
        <HourText hour={clockOut.hour} minute={clockOut.minute} />
      </TableCell>
    </TableRow>
  );
};
