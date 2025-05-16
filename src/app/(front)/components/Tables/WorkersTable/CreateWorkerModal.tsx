// components
import { ModalForm } from "../../Modal/ModalForm";
import { AddIconButton } from "../../Buttons/AddIconButton";

//icon
import { WorkerInputs } from "./WorkerInputs";

import { createWorker } from "./handlers";

interface ICreateWorkerModalProps {
  establishmentId: string;
  onCreate: () => void;
}

export const CreateWorkerModal = ({
  establishmentId,
  onCreate,
}: ICreateWorkerModalProps) => {
  return (
    <ModalForm
      title="Criar novo funcionário"
      handleSubmit={async (formData) => {
        await createWorker(formData);
        onCreate();
      }}
      submitButtonText="Criar"
      openButton={({ onPress }) => <AddIconButton onPress={onPress} />}
    >
      <WorkerInputs establishmentId={establishmentId} />
    </ModalForm>
  );
};
