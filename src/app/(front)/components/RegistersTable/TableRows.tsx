import { TableRow, TableCell } from "@heroui/table";
import { IDaySummary } from "./useTimeSheet";

const renderTimesCell = ({
  times,
  isMedicalLeave,
  status,
}: {
  times: string[];
  isMedicalLeave: boolean;
  status: string;
}) => {
  if (isMedicalLeave) return <TableCell>Atestado</TableCell>;
  if (status == "abscent") return <TableCell>Falta</TableCell>;
  if (status == "break") return <TableCell>Folga</TableCell>;

  return (
    <TableCell>
      <div className="flex flex-col  justify-center items-start">
        {times.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </div>
    </TableCell>
  );
};
export const renderTableRows = (timeSheet: IDaySummary[]) => {
  return timeSheet.map(
    ({ id, work_date, registers, is_medical_leave, status }) => {
      const clockinDate = new Date(work_date);
      clockinDate.setUTCHours(12, 0, 0, 0);

      const entrys: string[] = [];
      const outs: string[] = [];

      registers.forEach((register) => {
        const dateTime = new Date(register.clocked_at).toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        );
        if (register.is_entry) {
          entrys.push(dateTime);
        } else {
          outs.push(dateTime);
        }
      });
      return (
        <TableRow key={id}>
          <TableCell>{clockinDate.toLocaleDateString("pt-BR")}</TableCell>
          {renderTimesCell({
            times: entrys,
            isMedicalLeave: is_medical_leave,
            status,
          })}
          {renderTimesCell({
            times: outs,
            isMedicalLeave: is_medical_leave,
            status,
          })}
        </TableRow>
      );
    },
  );
};
