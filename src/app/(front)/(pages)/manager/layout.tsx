// next
import { cookies } from "next/headers";

//components
import { EstablishmentToggle } from "@/src/app/(front)/components/ToggleMenu/EstablishmentsToggle/EstablishmentToggle";
import { NavBar } from "@/src/app/(front)/components/Navbar/Navbar";
import { Unauthorized } from "@/src/app/(front)/components/Unauthorized";

// fetcher
import { axios } from "@/src/utils/fetcher";

interface ISession {
  session: {
    user: {
      name: string;
      id: string;
    };
    expires: string;
  };
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const { data } = await axios<ISession>({
    route: "/api/v1/worker/getSession",
    cookie: cookie.toString(),
  });

  if (!data?.session || !data.session.user) return <Unauthorized />;

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
