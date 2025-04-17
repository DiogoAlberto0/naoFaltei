import { cookies } from "next/headers";

//fetcher
import { axios } from "@/src/utils/fetcher";

//components
import { CalendarInput } from "@/src/app/(front)/components/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/app/(front)/components/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/app/(front)/components/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/app/(front)/components/WorkSchedule/WorkSchedule";
import { RegisterClockModal } from "./RegisterClockModal";

interface IWorkerPageProps {
  params: Promise<{ workerId: string }>;
}

export interface IWorker {
  id: string;
  name: string;
  login: string;
  cpf: string;
  phone: string;
  email: string;
  is_manager: boolean;
  is_admin: boolean;
  is_active: true;
  establishment_id: string;
}

const WorkerPage = async ({ params }: IWorkerPageProps) => {
  const { workerId } = await params;

  const cookie = await cookies();

  const { data: worker } = await axios<IWorker>({
    route: `/api/v1/worker/${workerId}/details`,
    cookie: cookie.toString(),
  });

  return (
    <div className="w-full h-full max-h-full overflow-auto p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <WorkerInfoCard worker={worker} />
        <WorkSchedule workerId={workerId} />

        <RegisterClockModal workerId={workerId} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
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
  );
};

export default WorkerPage;
