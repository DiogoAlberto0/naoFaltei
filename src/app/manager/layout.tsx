import { auth } from "@/auth";
import { EstablishmentToggle } from "@/src/components/EstablishmentsToggle/EstablishmentToggle";

import { NavBar } from "@/src/components/Navbar/Navbar";
import { Unauthorized } from "@/src/components/Unauthorized";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header fixo */}
      <NavBar />

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-sm:pb-12 relative">
          <EstablishmentToggle />
          {children}
        </div>
      </div>
    </div>
  );
}
