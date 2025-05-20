import { auth } from "@/auth"; // se quiser puxar os dados reais

//components
import { UpdateInfosForm } from "./UpdateInfosForm";
import { UserInfoCard } from "./UserInfoCard"; // novo componente

//hooks
import { getWorkerDetails } from "../../../hooks/worker/getWorkerDetails";
import { Unauthorized } from "../../../components/Unauthorized";
import { MonetagInterstitial } from "../../../ADS/Monetag/Interstitial";
import { MonetagInPagePush } from "../../../ADS/Monetag/InPagePush";

type SearchParams = Promise<{ demo?: string }>;
const UpdateInfosPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { demo } = await searchParams;
  const isDemo = demo?.toString().toLowerCase() === "true";

  const session = await auth();

  if (!isDemo && (!session || !session.user)) return <Unauthorized />;

  const { worker } = await getWorkerDetails(session?.user.id, isDemo);

  return (
    <main className="h-full w-full overflow-auto mx-auto flex flex-col gap-6 p-6 sm:p-8">
      <MonetagInterstitial />
      <MonetagInPagePush />
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

      <UpdateInfosForm workerId={worker.id} isDemo={isDemo} />
    </main>
  );
};

export default UpdateInfosPage;
