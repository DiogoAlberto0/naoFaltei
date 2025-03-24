// custom components
import { RegisterMap } from "./components/RegisterMap";
import { DateInfosHeader } from "./components/DateInfosHeader";

const WorkerPage = () => {
  return (
    <main className="min-h-full max-h-full overflow-auto w-full relative flex flex-col">
      <DateInfosHeader className="absolute z-10 left-0 top-0" />
      <div className="flex-1 flex">
        <RegisterMap />
      </div>

      <div className="bg-purple-500 h-10">Anuncio</div>
    </main>
  );
};

export default WorkerPage;
