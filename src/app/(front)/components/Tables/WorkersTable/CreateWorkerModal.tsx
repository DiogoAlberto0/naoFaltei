// components
import { ModalForm } from "../../Modal/ModalForm";
import { AddIconButton } from "../../Buttons/AddIconButton";

//icon
import { WorkerInputs } from "./WorkerInputs";

import { createWorker } from "./handlers";

interface ICreateWorkerModalProps {
  establishmentId: string;
}

export const CreateWorkerModal = ({
  establishmentId,
}: ICreateWorkerModalProps) => {
  return (
    <ModalForm
      title="Criar novo funcionário"
      handleSubmit={createWorker}
      submitButtonText="Criar"
      openButton={({ onPress }) => <AddIconButton onPress={onPress} />}
    >
      <WorkerInputs establishmentId={establishmentId} />
    </ModalForm>
  );
};
