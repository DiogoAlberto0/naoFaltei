import { auth } from "@/auth"; // se quiser puxar os dados reais

//components
import { UpdateInfosForm } from "./UpdateInfosForm";
import { UserInfoCard } from "./UserInfoCard"; // novo componente

//hooks
import { getWorkerDetails } from "../../../hooks/getWorkerDetails";

const UpdateInfosPage = async () => {
  const session = await auth();

  if (!session || !session.user) return null;

  const { worker } = await getWorkerDetails(session.user.id);

  return (
    <main className="h-full w-full max-w-screen-sm mx-auto flex flex-col gap-6 p-6 sm:p-8">
      <header className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Atualize seus dados
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Altere seu email ou senha
        </p>
      </header>

      <UserInfoCard
        name={worker.name}
        email={worker.email}
        login={worker.login}
        cpf={worker.cpf}
        phone={worker.phone}
      />

      <UpdateInfosForm workerId={worker.id} />
    </main>
  );
};

export default UpdateInfosPage;
