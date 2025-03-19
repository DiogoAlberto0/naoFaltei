import { CalendarInput } from "@/src/components/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/components/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/components/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/components/WorkSchedule/WorkSchedule";

interface IWorkerPageProps {
  params: Promise<{ workerId: string }>;
}

const WorkerPage = async ({ params }: IWorkerPageProps) => {
  const { workerId } = await params;
  return (
    <div className="w-full p-10 flex gap-1  ">
      <div className="max-h-max w-50 flex flex-col gap-1 ">
        <WorkerInfoCard />
        <WorkSchedule />
        <CalendarInput
          title="Definir data:"
          onSubmitRedirect="/manager/worker/1"
          className="min-h-min"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1 ">
        <RegistersTable title="20/03/2025 - 20/04/2025" maxRegisters={12} />
      </div>
    </div>
  );
};

export default WorkerPage;
