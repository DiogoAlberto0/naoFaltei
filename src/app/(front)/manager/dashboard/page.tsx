import { EstablishmentInfoCard } from "@/src/app/(front)/components/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "@/src/app/(front)/components/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/app/(front)/components/LocationCard/LocationCard";
import { LastRegistersByEstablishment } from "./LastRegistersByEstablishment";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ManagerDashboard(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const establishmentId = searchParams.establishmentId;

  if (typeof establishmentId != "string")
    return (
      <div className="w-full h-full flex justify-center items-center p-4 text-center">
        <h1 className="text-xl">Selecione um estabelecimento...</h1>
      </div>
    );

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
        />
        <WorkersTable establishmentId={establishmentId} />
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
        />
      </div>
    </div>
  );
}
