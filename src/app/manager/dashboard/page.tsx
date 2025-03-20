import { EstablishmentInfoCard } from "@/src/components/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "../../../components/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/components/LocationCard/LocationCard";
import { RegistersTable } from "../../../components/RegistersTable/RegistersTable";
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
    <div className="w-full p-5 sm:p-10 max-sm:p-0 max-sm:pl-10 flex gap-1 flex-wrap overflow-auto h-full max-h-full">
      <div className="flex-1 flex flex-col gap-1 md:max-h-full">
        <EstablishmentInfoCard
          id={establishmentId}
          name="Estabelecimento 1"
          phone="(61)98654-8270"
          email="estabelecimento1@email.com"
          cep="71805-703"
        />
        <WorkersTable establishmentId={establishmentId} />
      </div>
      <div className="flex-1 flex flex-col gap-1 md:max-h-full">
        <RegistersTable
          title="Últimos registros"
          maxRegisters={7}
          detailed={false}
        />
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
