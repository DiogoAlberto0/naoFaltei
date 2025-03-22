import { auth } from "@/auth";

//components
import { Unauthorized } from "@/src/components/Unauthorized";
import { WorkerToggleMenu } from "./components/WorkerToggleMenu";

export default async function WorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-sm:pb-12">
          <WorkerToggleMenu />
          <div className="bg-red-500 sm:ml-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
