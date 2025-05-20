import { auth } from "@/auth";

// components
import { RegistersTable } from "@/src/app/(front)/components/Tables/RegistersTable/RegistersTable";
import { CalendarInput } from "../../../components/Inputs/CalendarInput/CalendarInput";
import { Unauthorized } from "../../../components/Unauthorized";

// ADS
import { MonetagInterstitial } from "../../../ADS/Monetag/Interstitial";
import { MonetagInPagePush } from "../../../ADS/Monetag/InPagePush";

type SearchParams = Promise<{ demo?: boolean }>;
const TimeSheetPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { demo } = await searchParams;
  const isDemo = demo?.toString().toLowerCase() === "true";

  const session = await auth();

  if (!isDemo && (!session || !session.user)) return <Unauthorized />;

  return (
    <main className="h-full w-full overflow-auto mx-auto flex flex-col gap-6 px-2 py-4 sm:px-4 md:px-6 lg:px-8">
      <MonetagInterstitial />
      <MonetagInPagePush />
      <header className="text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Folha de Ponto
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Consulte os registros e o resumo mensal de ponto
        </p>
      </header>

      <section className="w-full">
        <CalendarInput
          title="Selecione um intervalo de datas"
          onSubmitRedirect="/worker/timeSheet"
          isDemo={isDemo}
        />
      </section>

      <section className="w-full">
        <RegistersTable
          workerId={session?.user.id || ""}
          detailed
          maxRegisters={10}
          overflowAuto={true}
          isDemo={isDemo}
        />
      </section>
    </main>
  );
};

export default TimeSheetPage;
