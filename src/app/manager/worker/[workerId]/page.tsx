import { CalendarInput } from "@/src/components/CalendarInput/CalendarInput";
import { RegistersTable } from "@/src/components/RegistersTable/RegistersTable";
import { WorkerInfoCard } from "@/src/components/WorkerInfoCard/WorkerInfoCard";
import { WorkSchedule } from "@/src/components/WorkSchedule/WorkSchedule";

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
    <div className="w-full p-5 sm:p-10 max-sm:p-5 flex gap-1 flex-wrap overflow-auto h-full max-h-full">
      <div className="flex-1 flex flex-col gap-1 md:max-h-full">
        <WorkerInfoCard />
        <WorkSchedule />
        <CalendarInput
          title="Definir data:"
          onSubmitRedirect="/manager/worker/1"
          className="min-h-min"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1 md:max-h-full">
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
