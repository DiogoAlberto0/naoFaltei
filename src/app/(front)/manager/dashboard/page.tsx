//next
import { cookies } from "next/headers";

//components
import { EstablishmentInfoCard } from "@/src/app/(front)/components/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "@/src/app/(front)/components/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/app/(front)/components/LocationCard/LocationCard";
import { LastRegistersByEstablishment } from "./LastRegistersByEstablishment";

//fetcher
import { axios } from "@/src/utils/fetcher";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { cepUtils } from "@/src/utils/cep";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface IEstablishment {
  name: string;
  phone: string;
  email: string;
  cep: string;
  lat: number;
  lng: number;
  ratio: number;
}
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
  else {
    const cookie = await cookies();
    const { data: establishmentData } = await axios<IEstablishment>({
      route: `/api/v1/establishment/${establishmentId}/details`,
      cookie: cookie.toString(),
      revalidateTags: [`establishmentId=${establishmentId}`],
    });

    return (
      <div className="w-full h-full max-h-full overflow-auto p-5 md:p-10 flex flex-col lg:flex-row gap-4">
        {/* Coluna da esquerda */}
        <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
          <EstablishmentInfoCard
            id={establishmentId}
            name={establishmentData.name}
            phone={phoneUtils.format(establishmentData.phone)}
            email={establishmentData.email}
            cep={cepUtils.format(establishmentData.cep)}
          />
          <WorkersTable establishmentId={establishmentId} />
        </div>

        {/* Coluna da direita */}
        <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
          <LastRegistersByEstablishment
            establishmentId={establishmentId}
            title="Últimos registros"
            maxRegisters={7}
          />

          <LocationCard
            className="w-full flex-1 min-h-[300px]"
            establishmentId={establishmentId}
            markerPosition={{
              lat: establishmentData.lat,
              lng: establishmentData.lng,
            }}
            ratio={establishmentData.ratio}
          />
        </div>
      </div>
    );
  }
}
