import { CalendarInput } from "@/src/app/(front)/components/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/app/(front)/components/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/app/(front)/components/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/app/(front)/components/WorkSchedule/WorkSchedule";
import { RegisterClockModal } from "./RegisterClockModal";

interface IWorkerPageProps {
  params: Promise<{ workerId: string }>;
}

const WorkerPage = async (
  {
    //params
  }: IWorkerPageProps,
) => {
  //const { workerId } = await params;
  return (
    <div className="w-full h-full max-h-full overflow-auto p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <WorkerInfoCard
          worker={{
            cpf: "123.456.789-00",
            email: "joao.silva@email.com",
            establishment_id: "est-001",
            id: "worker-001",
            is_active: true,
            is_admin: false,
            is_manager: true,
            login: "joaosilva",
            name: "João Silva",
            phone: "(11) 91234-5678",
          }}
        />
        <WorkSchedule workerId="123" />
        <RegisterClockModal />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <CalendarInput
          title="Definir data:"
          onSubmitRedirect="/manager/worker/1"
        />
        <RegistersTable workerId="123" maxRegisters={12} overflowAuto={false} />
      </div>
    </div>
  );
};

export default WorkerPage;
