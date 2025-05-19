import { EstablishmentToggle } from "@/src/app/(front)/components/ToggleMenu/EstablishmentsToggle/EstablishmentToggle";
import { NavBar } from "@/src/app/(front)/components/Navbar/Navbar";
import { InstalPrompt } from "../../components/Pwa/InstalPrompt";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh w-dvw max-h-dvh flex flex-col overflow-hidden relative">
      <InstalPrompt />

      <Suspense>
        <EstablishmentToggle />
        <NavBar className="sm:pl-10" />
      </Suspense>

      <div className="flex-1 overflow-auto max-sm:pb-14 sm:pl-10">
        {children}
      </div>
    </div>
  );
}
