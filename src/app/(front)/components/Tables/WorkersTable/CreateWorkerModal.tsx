// components
import { ModalForm } from "../../Modal/ModalForm";
import { AddIconButton } from "../../Buttons/AddIconButton";

//icon
import { WorkerInputs } from "./WorkerInputs";

import { createWorker } from "./handlers";
import { addToast } from "@heroui/toast";

interface ICreateWorkerModalProps {
  establishmentId: string;
  onCreate: () => void;
  isDemo?: boolean;
}

export const CreateWorkerModal = ({
  establishmentId,
  onCreate,
  isDemo = false,
}: ICreateWorkerModalProps) => {
  return (
    <ModalForm
      title="Criar novo funcionário"
      handleSubmit={async (formData) => {
        if (isDemo)
          return addToast({
            title: "Você está em uma versão demo",
            color: "warning",
          });
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
