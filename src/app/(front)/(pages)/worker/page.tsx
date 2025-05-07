// custom components
import { RegisterMap } from "./components/RegisterMap";
import { DateInfosHeader } from "./components/DateInfosHeader";
import { auth } from "@/auth";
import { Unauthorized } from "../../components/Unauthorized";
import { AdBanner } from "../../ADS/Adsterra/AdBanner";
import { InstalPrompt } from "../../components/Pwa/InstalPrompt";

const WorkerPage = async () => {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;
  return (
    <main className="h-full overflow-auto w-full relative flex flex-col">
      <InstalPrompt />
      <DateInfosHeader className="absolute z-10 left-0 top-0" />
      <div className="flex-1 flex">
        <RegisterMap />
      </div>

      <div className="bg-primary-100 flex justify-center items-center h-[60px] md:h-[90px]">
        <AdBanner />
      </div>
    </main>
  );
};

export default WorkerPage;
