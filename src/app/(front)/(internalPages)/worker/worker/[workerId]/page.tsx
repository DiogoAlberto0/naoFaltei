//components
import { CalendarInput } from "@/src/app/(front)/components/Inputs/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/app/(front)/components/Tables/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/app/(front)/components/Cards/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/app/(front)/components/Tables/WorkSchedule/WorkSchedule";
import { RegisterClockModal } from "../../../../components/Modal/RegisterClockinModal/RegisterClockModal";
import { RegisterMedicalLeaveModal } from "@/src/app/(front)/components/Modal/RegisterMedicalLeaveModal/RegisterMedicalLeave";

// getter
import { getWorkerDetails } from "@/src/app/(front)/hooks/worker/getWorkerDetails";

interface IWorkerPageProps {
  params: Promise<{ workerId: string }>;
}

const WorkerPage = async ({ params }: IWorkerPageProps) => {
  const { workerId } = await params;
  const { worker } = await getWorkerDetails(workerId);

  return (
    <div className="w-full h-full max-h-full overflow-auto p-2 sm:p-4 md:p-6 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Coluna esquerda */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <WorkerInfoCard worker={worker} />
          <WorkSchedule workerId={workerId} />
          <RegisterClockModal workerId={workerId} />
          <RegisterMedicalLeaveModal workerId={workerId} />
        </div>

        {/* Coluna direita */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <CalendarInput
            title="Definir data:"
            onSubmitRedirect={`/manager/worker/${workerId}`}
          />
          <RegistersTable
            workerId={workerId}
            maxRegisters={12}
            overflowAuto={false}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkerPage;
