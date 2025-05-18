//components
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
      <NavBar />
      <Suspense>
        <EstablishmentToggle />
      </Suspense>

      <div className="flex-1 h-full w-full max-w-full overflow-auto">
        <div className="flex-1 h-full w-full max-w-full overflow-auto max-sm:pb-12 sm:pl-10">
          {children}
        </div>
      </div>
    </div>
  );
}
