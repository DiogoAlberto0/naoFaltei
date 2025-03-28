//heroui
import { Chip } from "@heroui/chip";
// custom components
import { TimeSheetModal } from "../TimeSheetModal/TimeSheetModal";
const TopContentDetails = ({
  absenceDays,
  hoursBank,
  medicalCertificateDays,
  tardinessDays,
}: {
  medicalCertificateDays: number;
  hoursBank: number;
  tardinessDays: number;
  absenceDays: number;
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Chip size="sm" variant="shadow" color="primary">
        Atestados: {medicalCertificateDays} dias
      </Chip>
      <Chip
        size="sm"
        variant="shadow"
        color={hoursBank >= 0 ? "success" : "danger"}
      >
        Banco de horas: {hoursBank}
      </Chip>
      <Chip size="sm" variant="shadow" color="warning">
        Atrasos: {tardinessDays} dias
      </Chip>
      <Chip size="sm" variant="shadow" color="danger">
        Faltas: {absenceDays} dias
      </Chip>
    </div>
  );
};
export const TopContentRegistersTable = ({
  title,
  detailed,
  ...otherProps
}: {
  title: string;
  detailed: boolean;
  medicalCertificateDays: number;
  hoursBank: number;
  tardinessDays: number;
  absenceDays: number;
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className=" w-full flex justify-between items-center">
        <h1 className="text-xl">{title}</h1>
        {detailed && <TimeSheetModal />}
      </div>
      {detailed && <TopContentDetails {...otherProps} />}
    </div>
  );
};
