//Components
import { EditButton } from "../../Buttons/EditButton";
import { ModalForm } from "../../Modal/ModalForm";
import { addToast } from "@heroui/toast";

// handler
import { setScheduleHandler } from "./setScheduleHandler";
import { SetScheduleModalBody } from "./SetScheduleModalBody";
import { ISchedule } from "../../../hooks/schedule/schedule.types";
import { useScheduleDayOffsState } from "../../../hooks/schedule/useScheduleDayOffsState";

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
  const { daysOff, toggleDayOff } = useScheduleDayOffsState(prevSchedule);
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
      <SetScheduleModalBody
        daysOff={daysOff}
        toggleDayOff={toggleDayOff}
        workerId={workerId}
        prevSchedule={prevSchedule}
      />
    </ModalForm>
  );
};
