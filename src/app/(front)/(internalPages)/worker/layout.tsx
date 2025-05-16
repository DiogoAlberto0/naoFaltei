//components
import { WorkerToggleMenu } from "./components/WorkerToggleMenu";
import { verifyIfUserIsManager } from "../../hooks/verifyIfUserIsWorker";

export default async function WorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isManager = await verifyIfUserIsManager();
  return (
    <div className="h-dvh w-dvw max-h-dvh flex flex-col overflow-hidden relative">
      <WorkerToggleMenu isManager={isManager} />
      <div className="flex-1 h-full w-full max-w-full overflow-auto max-sm:pb-14 sm:pl-10">
        {children}
      </div>
    </div>
  );
}
