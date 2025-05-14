// next
import { auth } from "@/auth";

//components
import { EstablishmentToggle } from "@/src/app/(front)/components/ToggleMenu/EstablishmentsToggle/EstablishmentToggle";
import { NavBar } from "@/src/app/(front)/components/Navbar/Navbar";
import { Unauthorized } from "@/src/app/(front)/components/Unauthorized";
import { InstalPrompt } from "../../components/Pwa/InstalPrompt";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  return (
    <div className="h-dvh w-dvw max-h-dvh flex flex-col overflow-hidden relative">
      <InstalPrompt />

      <NavBar />
      <EstablishmentToggle />
      <div className="flex-1 h-full w-full max-w-full overflow-auto relative">
        <div className="flex-1 h-full w-full max-w-full overflow-auto max-sm:pb-12 sm:pl-10">
          {children}
        </div>
      </div>
    </div>
  );
}
