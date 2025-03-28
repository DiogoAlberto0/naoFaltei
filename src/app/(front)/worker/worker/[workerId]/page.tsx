import { CalendarInput } from "@/src/components/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/components/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/components/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/components/WorkSchedule/WorkSchedule";
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
        <WorkerInfoCard />
        <WorkSchedule />
        <RegisterClockModal />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <CalendarInput
          title="Definir data:"
          onSubmitRedirect="/manager/worker/1"
        />
        <RegistersTable
          title="20/03/2025 - 20/04/2025"
          maxRegisters={12}
          overflowAuto={false}
        />
      </div>
    </div>
  );
};

export default WorkerPage;
