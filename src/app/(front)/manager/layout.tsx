import { auth } from "@/auth";
import { EstablishmentToggle } from "@/src/app/(front)/components/EstablishmentsToggle/EstablishmentToggle";

import { NavBar } from "@/src/app/(front)/components/Navbar/Navbar";
import { Unauthorized } from "@/src/app/(front)/components/Unauthorized";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <div className="h-dvh w-dvw max-h-dvh flex flex-col overflow-hidden relative">
      <NavBar />
      <div className="flex-1 h-full w-full max-w-full overflow-auto relative">
        <EstablishmentToggle />
        <div className="flex-1 h-full w-full max-w-full overflow-auto max-sm:pb-12 sm:pl-10">
          {children}
        </div>
      </div>
    </div>
  );
}
