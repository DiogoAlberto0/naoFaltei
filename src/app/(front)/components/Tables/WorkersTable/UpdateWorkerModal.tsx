import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";

//components
import { ModalForm } from "../../Modal/ModalForm";
import { WorkerInputs } from "./WorkerInputs";
import { EditButton } from "../../Buttons/EditButton";
import { EditIcon } from "@/assets/icons/EditIcon";
import { ComponentError } from "../../ComponentError";
//handler
import { updateWorker } from "./handlers";

// hero ui
import { addToast, Spinner, Tooltip } from "@heroui/react";

interface IWorker {
  id: string;
  name: string;
  login: string;
  cpf: string;
  phone: string;
  email: string;
  is_manager: boolean;
  is_admin: boolean;
  is_active: boolean;
  establishment_id: string;
}
const fakeWorker: IWorker = {
  id: "worker-001",
  name: "Lucas Andrade",
  login: "lucas.andrade",
  cpf: "123.456.789-00",
  phone: "(11) 91234-5678",
  email: "lucas.andrade@example.com",
  is_manager: true,
  is_admin: false,
  is_active: true,
  establishment_id: "estab-123",
};

const EditTooltip = ({ onPress }: { onPress: () => void }) => {
  return (
    <Tooltip content="Editar funcionário">
      <span
        onClick={onPress}
        className="text-lg text-default-400 cursor-pointer active:opacity-50"
      >
        <EditIcon />
      </span>
    </Tooltip>
  );
};
const UpdateWorkerFormWithoutData = ({ workerId }: { workerId?: string }) => {
  const {
    data: worker,
    isLoading,
    error,
  } = useSWR<IWorker>(`/api/v1/worker/${workerId}/details`, fetcher);

  if (isLoading) return <Spinner />;
  if (error || !worker)
    return <ComponentError message={error.message} action={error.action} />;

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
      isManager={true}
    />
  );
};
const UpdateWorkerForm = ({ worker }: { worker: IWorker }) => {
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
export const UpdateWorkerModal = ({
  worker: originalWorker,
  workerId,
  isButton = true,
  isDemo = false,
}: {
  worker?: IWorker;
  workerId?: string;
  isButton?: boolean;
  isDemo?: boolean;
}) => {
  const worker = isDemo ? fakeWorker : originalWorker;

  return (
    <ModalForm
      title="Criar novo funcionário"
      handleSubmit={async (formData) => {
        if (isDemo)
          return addToast({
            title: "Você está em uma versão demo",
            color: "warning",
          });
        await updateWorker(formData);
      }}
      submitButtonText="Criar"
      openButton={({ onPress }) =>
        isButton ? (
          <EditButton onPress={onPress} isIconOnly />
        ) : (
          <EditTooltip onPress={onPress} />
        )
      }
    >
      {worker ? (
        <UpdateWorkerForm worker={worker} />
      ) : (
        <UpdateWorkerFormWithoutData workerId={workerId} />
      )}
    </ModalForm>
  );
};
