//heroui
import { Chip } from "@heroui/chip";
// custom components
import { TimeSheetModal } from "../../Modal/TimeSheetModal/TimeSheetModal";

// hooks
import { IDaySummary } from "./useTimeSheet";
import { dateUtils } from "@/src/utils/date";

const BankHourChip = ({ hoursBank }: { hoursBank: number }) => {
  const isNegative = hoursBank < 0;
  return (
    <Chip size="sm" variant="shadow" color={isNegative ? "danger" : "success"}>
      Banco de horas: {isNegative ? "-" : ""}{" "}
      {dateUtils.transformMinutesInTime(hoursBank, { variant: "letter" })}
    </Chip>
  );
};
const TopContentDetails = ({
  absenceDays,
  hoursBank,
  medicalCertificateDays,
}: {
  medicalCertificateDays?: number;
  hoursBank?: number;
  absenceDays?: number;
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {medicalCertificateDays != undefined && (
        <Chip size="sm" variant="shadow" color="primary">
          Atestados: {medicalCertificateDays} dias
        </Chip>
      )}

      {hoursBank != undefined && <BankHourChip hoursBank={hoursBank} />}
      {absenceDays != undefined && (
        <Chip size="sm" variant="shadow" color="danger">
          Faltas: {absenceDays} dias
        </Chip>
      )}
    </div>
  );
};
export const TopContentRegistersTable = ({
  title,
  detailed,
  timeSheet,
  ...otherProps
}: {
  title: string;
  detailed: boolean;
  timeSheet: IDaySummary[];
  medicalCertificateDays?: number;
  hoursBank?: number;
  absenceDays?: number;
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className=" w-full flex justify-between items-center">
        <h1 className="text-xl">{title}</h1>
        {detailed && <TimeSheetModal timeSheet={timeSheet} />}
      </div>
      {detailed && <TopContentDetails {...otherProps} />}
    </div>
  );
};
