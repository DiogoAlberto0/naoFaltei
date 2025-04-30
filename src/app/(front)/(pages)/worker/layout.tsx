import { auth } from "@/auth";

//components
import { Unauthorized } from "@/src/app/(front)/components/Unauthorized";
import { WorkerToggleMenu } from "./components/WorkerToggleMenu";

export default async function WorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <div className="h-dvh w-dvw max-h-dvh flex flex-col overflow-hidden relative">
      <WorkerToggleMenu />
      <div className="flex-1 h-full w-full max-w-full overflow-auto max-sm:pb-14 sm:pl-10">
        {children}
      </div>
    </div>
  );
}
