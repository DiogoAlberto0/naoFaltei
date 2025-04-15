//Components
import { EditButton } from "../Buttons/EditButton";
import { ModalForm } from "../Modal/ModalForm";

// handler
import { setScheduleHandler } from "./setScheduleHandler";
import { ISchedule } from "./WorkSchedule";
import { useScheduleState } from "./useScheduleState";
import { SetScheduleModalBody } from "./SetScheduleModalBody";

export const SetScheduleModal = ({
  workerId,
  prevSchedule,
  updateSchedule,
}: {
  workerId: string;
  prevSchedule: ISchedule | undefined;
  updateSchedule: () => void;
}) => {
  const { daysOff, toggleDayOff } = useScheduleState(prevSchedule);
  return (
    <ModalForm
      handleSubmit={setScheduleHandler}
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
