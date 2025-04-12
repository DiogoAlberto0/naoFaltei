//next
import { useRouter } from "next/navigation";

//fetcher
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";

//components
import { ModalForm } from "../Modal/ModalForm";
import { EditIcon } from "@/assets/icons/EditIcon";
import { WorkerInputs } from "./WorkerInputs";

//fero ui
import { Button } from "@heroui/button";
import { Spinner, Tooltip } from "@heroui/react";

//handler
import { updateWorker } from "./handlers";

const EditToolTip = ({ onPress }: { onPress: () => void }) => {
  return (
    <Tooltip content="Edit user">
      <span
        onClick={onPress}
        className="text-lg text-default-400 cursor-pointer active:opacity-50"
      >
        <EditIcon />
      </span>
    </Tooltip>
  );
};
export const UpdateWorkerModal = ({ workerId }: { workerId: string }) => {
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    `/api/v1/worker/${workerId}/details`,
    fetcher,
  );
  const UpdateWorkerForm = () => {
    if (error || data?.message)
      return (
        <div className="h-[50vh] flex flex-col gap-2 justify-center items-center">
          <h1>Falha ao carregar os dados do funcionário</h1>
          {data?.message && <h2>{data.message}</h2>}
          {data?.action && <p>{data.action}</p>}
          <Button onPress={() => router.refresh()}>Tentar novamente</Button>
        </div>
      );
    else if (isLoading)
      return (
        <div className="h-[50vh] flex justify-center items-center">
          <Spinner />
        </div>
      );
    else {
      return (
        <WorkerInputs
          workerId={workerId}
          establishmentId={data.establishment_id}
          name={data.name}
          phone={data.phone}
          cpf={data.cpf}
          email={data.email}
          login={data.login}
          isUpdate
        />
      );
    }
  };

  return (
    <ModalForm
      title="Criar novo funcionário"
      handleSubmit={updateWorker}
      submitButtonText="Criar"
      openButton={({ onPress }) => <EditToolTip onPress={onPress} />}
    >
      <UpdateWorkerForm />
    </ModalForm>
  );
};
