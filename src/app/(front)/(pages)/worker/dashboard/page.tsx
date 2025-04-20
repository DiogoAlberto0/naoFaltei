import { EstablishmentInfoCard } from "@/src/app/(front)/components/Cards/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "@/src/app/(front)/components/Tables/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/app/(front)/components/Cards/LocationCard/LocationCard";
import { LastRegistersByEstablishment } from "./LastRegistersByEstablishment";

export default async function ManagerDashboard() {
  const establishmentId = "123";
  return (
    <div className="w-full h-full max-h-full overflow-auto p-5 md:p-10 flex flex-col lg:flex-row gap-4">
      {/* Coluna da esquerda */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        <EstablishmentInfoCard
          id={establishmentId}
          name="Estabelecimento 1"
          phone="(61)98654-8270"
          email="estabelecimento1@email.com"
          cep="71805-703"
          isEditable={false}
        />
        <WorkersTable
          establishmentId={establishmentId}
          isWorkerEditable={false}
        />
      </div>

      {/* Coluna da direita */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        <LastRegistersByEstablishment
          title="Últimos registros"
          maxRegisters={7}
        />
        <LocationCard
          className="w-full flex-1 min-h-[300px]"
          establishmentId={establishmentId}
          markerPosition={{ lat: -15.12345, lng: -45.54321 }}
          isEditable={false}
          ratio={1}
        />
      </div>
    </div>
  );
}
