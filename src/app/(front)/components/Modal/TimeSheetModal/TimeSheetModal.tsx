//heroui
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

//components
import { ModalFullSize } from "../ModalFullSize";
import { FullScreenIconButton } from "../../Buttons/FullScreenIconButton";
import { IDaySummary } from "../../Tables/RegistersTable/useTimeSheet";
import { dateUtils } from "@/src/utils/date";

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

export const TimeSheetModal = ({ timeSheet }: { timeSheet: IDaySummary[] }) => {
  return (
    <ModalFullSize
      title="Folha de ponto do Diogo Alberto. Data: 10/02/2025 - 10/03/2025"
      openButton={({ onPress }) => <FullScreenIconButton onPress={onPress} />}
    >
      <Table className="max-h-full" isStriped>
        <TableHeader>
          <TableColumn>Data</TableColumn>
          <TableColumn>D. Semana</TableColumn>
          <TableColumn>Entrada</TableColumn>
          <TableColumn>Saida</TableColumn>
          <TableColumn>H/ descanso</TableColumn>
          <TableColumn>H. trabalhadas</TableColumn>
        </TableHeader>
        <TableBody>
          {timeSheet.map(
            ({
              id,
              work_date,
              rested_minutes,
              worked_minutes,
              registers,
              is_medical_leave,
              status,
            }) => {
              const workDate = new Date(work_date);
              workDate.setUTCHours(12, 0, 0, 0);

              const entrys: string[] = [];
              const outs: string[] = [];

              registers.forEach((register) => {
                const dateTime = new Date(
                  register.clocked_at,
                ).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                if (register.is_entry) {
                  entrys.push(dateTime);
                } else {
                  outs.push(dateTime);
                }
              });

              return (
                <TableRow key={id}>
                  <TableCell>{workDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {workDate.toLocaleString("pt-br", { weekday: "short" })}
                  </TableCell>
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
                  <TableCell>
                    {dateUtils.transformMinutesInTime(rested_minutes, {
                      variant: "letter",
                    })}
                  </TableCell>
                  <TableCell>
                    {dateUtils.transformMinutesInTime(worked_minutes, {
                      variant: "letter",
                    })}
                  </TableCell>
                </TableRow>
              );
            },
          )}
        </TableBody>
      </Table>
    </ModalFullSize>
  );
};
