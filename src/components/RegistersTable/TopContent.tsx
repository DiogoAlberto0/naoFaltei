// heroui components
import { Button, Chip, useDisclosure } from "@heroui/react";

// icons
import { FullScreenIcon } from "@/assets/icons/FullScreenIcon";

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
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <div className="w-full flex flex-col gap-1">
      <div className=" w-full flex justify-between items-center">
        <h1 className="text-xl">{title}</h1>
        {detailed && (
          <>
            <TimeSheetModal isOpen={isOpen} onOpenChange={onOpenChange} />
            <Button
              startContent={<FullScreenIcon className="h-5 w-5" />}
              isIconOnly
              color="primary"
              variant="shadow"
              onPress={onOpen}
            />
          </>
        )}
      </div>
      {detailed && <TopContentDetails {...otherProps} />}
    </div>
  );
};
