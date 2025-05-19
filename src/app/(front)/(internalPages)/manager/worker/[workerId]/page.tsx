import { auth } from "@/auth";
//components
import { CalendarInput } from "@/src/app/(front)/components/Inputs/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/app/(front)/components/Tables/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/app/(front)/components/Cards/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/app/(front)/components/Tables/WorkSchedule/WorkSchedule";
import { RegisterClockModal } from "../../../../components/Modal/RegisterClockinModal/RegisterClockModal";
import { RegisterMedicalLeaveModal } from "@/src/app/(front)/components/Modal/RegisterMedicalLeaveModal/RegisterMedicalLeave";
import { Unauthorized } from "@/src/app/(front)/components/Unauthorized";

// getter
import { getWorkerDetails } from "@/src/app/(front)/hooks/worker/getWorkerDetails";
import { CountdownAdModal } from "@/src/app/(front)/ADS/Adsterra/CountdownAdModal";

interface IWorkerPageProps {
  params: Promise<{ workerId: string }>;
  searchParams: Promise<{ demo?: string }>;
}

const WorkerPage = async ({ params, searchParams }: IWorkerPageProps) => {
  const session = await auth();

  const { demo } = await searchParams;
  const isDemo = demo?.toString().toLowerCase() === "true";

  if (!isDemo && (!session || !session.user)) return <Unauthorized />;

  const { workerId } = await params;
  const { worker } = await getWorkerDetails(workerId, isDemo);

  return (
    <div className="w-full h-full max-h-full overflow-auto p-2 sm:p-4 md:p-6 flex flex-col gap-6">
      <CountdownAdModal />
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Coluna esquerda */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <WorkerInfoCard worker={worker} isDemo={isDemo} />
          <WorkSchedule workerId={workerId} isDemo={isDemo} />
          <RegisterClockModal workerId={workerId} isDemo={isDemo} />
          <RegisterMedicalLeaveModal workerId={workerId} isDemo={isDemo} />
        </div>

        {/* Coluna direita */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <CalendarInput
            title="Definir data:"
            onSubmitRedirect={`/manager/worker/${workerId}`}
            isDemo={isDemo}
          />
          <RegistersTable
            workerId={workerId}
            maxRegisters={12}
            overflowAuto={false}
            isDemo={isDemo}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkerPage;
