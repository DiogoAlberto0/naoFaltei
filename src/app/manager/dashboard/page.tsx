import { EstablishmentInfoCard } from "@/src/components/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "../../../components/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/components/LocationCard/LocationCard";
import { LastRegistersTable } from "../../../components/LastRegistersTable/LastRegistersTable";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ManagerDashboard(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const establishmentId = searchParams.establishmentId;

  if (typeof establishmentId != "string")
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-xl">Selecione um estabelecimento...</h1>
      </div>
    );
  return (
    <div className="w-full p-10 flex gap-1">
      <div className="flex-1 flex flex-col gap-1">
        <EstablishmentInfoCard
          id={establishmentId}
          name="Estabelecimento 1"
          phone="(61)98654-8270"
          email="estabelecimento1@email.com"
          cep="71805-703"
        />
        <WorkersTable establishmentId={establishmentId} />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <LastRegistersTable />
        <LocationCard
          establishmentId={establishmentId}
          markerPosition={{
            lat: -15.12345,
            lng: -45.54321,
          }}
        />
      </div>
    </div>
  );
}
