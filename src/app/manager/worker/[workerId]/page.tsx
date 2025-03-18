interface IWorkerPageProps {
  params: Promise<{ workerId: string }>;
}
const WorkerPage = async ({ params }: IWorkerPageProps) => {
  const { workerId } = await params;
  return (
    <div className="w-full p-10 flex gap-1  bg-red-500">
      <div className="flex-1 flex flex-col gap-1 bg-blue-500"></div>
      <div className="flex-1 flex flex-col gap-1 bg-pink-500"></div>
    </div>
  );
};

export default WorkerPage;
