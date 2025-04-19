//components
import { ModalForm } from "../Modal/ModalForm";
import { WorkerInputs } from "./WorkerInputs";
import { EditButton } from "../Buttons/EditButton";
//handler
import { updateWorker } from "./handlers";
import { IWorker } from "../../manager/worker/[workerId]/getWorker";

export const UpdateWorkerModal = ({ worker }: { worker: IWorker }) => {
  const UpdateWorkerForm = () => {
    return (
      <WorkerInputs
        workerId={worker.id}
        establishmentId={worker.establishment_id}
        name={worker.name}
        phone={worker.phone}
        cpf={worker.cpf}
        email={worker.email}
        login={worker.login}
        isUpdate
        isManager={worker.is_manager}
      />
    );
  };

  return (
    <ModalForm
      title="Criar novo funcionário"
      handleSubmit={updateWorker}
      submitButtonText="Criar"
      openButton={({ onPress }) => <EditButton onPress={onPress} isIconOnly />}
    >
      <UpdateWorkerForm />
    </ModalForm>
  );
};
