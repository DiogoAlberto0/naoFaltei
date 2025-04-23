import { auth } from "@/auth";

// components
import { RegistersTable } from "@/src/app/(front)/components/Tables/RegistersTable/RegistersTable";
import { CalendarInput } from "../../../components/Inputs/CalendarInput/CalendarInput";
import { Unauthorized } from "../../../components/Unauthorized";

const TimeSheetPage = async () => {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <main className="h-full w-full max-w-screen-lg mx-auto flex flex-col gap-6 p-4 sm:p-6">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Folha de Ponto
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Consulte os registros e o resumo mensal de ponto
        </p>
      </header>

      <section className="w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-4 border border-zinc-200 dark:border-zinc-800">
        <CalendarInput
          title="Selecione um intervalo de datas"
          onSubmitRedirect="/worker/timeSheet"
        />
      </section>

      <section className="w-full flex-1 min-h-0 overflow-hidden">
        <RegistersTable workerId={session.user.id} detailed maxRegisters={10} />
      </section>
    </main>
  );
};

export default TimeSheetPage;
