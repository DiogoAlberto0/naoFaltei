//Components
import { EditButton } from "../../../Buttons/EditButton";
import { ModalForm } from "../../../Modal/ModalForm";
import { addToast } from "@heroui/toast";

// handler
import { setScheduleHandler } from "../setScheduleHandler";
import { SetScheduleModalBody } from "./SetScheduleModalBody";
import { ISchedule } from "../../../../hooks/schedule/schedule.types";
import { Input } from "@heroui/react";

export const SetScheduleModal = ({
  workerId,
  prevSchedule,
  updateSchedule,
  isDemo = false,
}: {
  workerId: string;
  prevSchedule: ISchedule | undefined;
  updateSchedule: () => void;
  isDemo?: boolean;
}) => {
  return (
    <ModalForm
      handleSubmit={async (formData) => {
        if (isDemo)
          return addToast({
            title: "Você está em uma versão demo",
            color: "warning",
          });
        else await setScheduleHandler(formData);
      }}
      openButton={({ onPress }) => <EditButton onPress={onPress} isIconOnly />}
      submitButtonText="Salvar"
      onUpdate={updateSchedule}
    >
      <Input type="hidden" name="workerId" value={workerId} />
      <SetScheduleModalBody prevSchedule={prevSchedule} />
    </ModalForm>
  );
};
