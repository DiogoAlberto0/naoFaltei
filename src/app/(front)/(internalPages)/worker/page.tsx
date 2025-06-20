import { auth } from "@/auth";

// custom components
import { RegisterMap } from "./components/RegisterMap";
import { DateInfosHeader } from "./components/DateInfosHeader";
import { Unauthorized } from "../../components/Unauthorized";
import { InstalPrompt } from "../../components/Pwa/InstalPrompt";

type SearchParams = Promise<{ demo?: boolean }>;
const WorkerPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { demo } = await searchParams;
  const isDemo = demo?.toString().toLowerCase() === "true";

  const session = await auth();

  if (!isDemo && (!session || !session.user)) return <Unauthorized />;
  return (
    <main className="h-full overflow-auto w-full relative flex flex-col">
      <InstalPrompt />
      <DateInfosHeader
        className="absolute z-10 left-0 top-0"
        name={session?.user.name || "Nome do funcionário"}
        isDemo={isDemo}
      />
      <div className="flex-1 flex">
        <RegisterMap isDemo={isDemo} />
      </div>

      <div className="bg-primary-100 flex justify-center items-center h-[60px] md:h-[90px]">
        Espaço reservado para anuncio
      </div>
    </main>
  );
};

export default WorkerPage;
