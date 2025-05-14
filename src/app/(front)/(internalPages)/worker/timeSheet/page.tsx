import { auth } from "@/auth";

// components
import { RegistersTable } from "@/src/app/(front)/components/Tables/RegistersTable/RegistersTable";
import { CalendarInput } from "../../../components/Inputs/CalendarInput/CalendarInput";
import { Unauthorized } from "../../../components/Unauthorized";
import { CountdownAdModal } from "../../../ADS/Adsterra/CountdownAdModal";

const TimeSheetPage = async () => {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <main className="h-full w-full overflow-auto mx-auto flex flex-col gap-6 px-2 py-4 sm:px-4 md:px-6 lg:px-8">
      <CountdownAdModal />
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
        />
      </section>

      <section className="w-full">
        <RegistersTable
          workerId={session.user.id}
          detailed
          maxRegisters={10}
          overflowAuto={true}
        />
      </section>
    </main>
  );
};

export default TimeSheetPage;
