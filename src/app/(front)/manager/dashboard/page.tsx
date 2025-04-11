import { EstablishmentInfoCard } from "@/src/app/(front)/components/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "@/src/app/(front)/components/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/app/(front)/components/LocationCard/LocationCard";
import { LastRegistersByEstablishment } from "./LastRegistersByEstablishment";
import { axios } from "@/src/utils/fetcher";
import { cookies } from "next/headers";
import { phoneUtils } from "@/src/utils/phone";
import { cepUtils } from "@/src/utils/cep";
import { FetchError } from "@/src/Errors/errors";
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
  else {
    const cookie = await cookies();
    const { data: establishmentData, response } = await axios({
      route: `/api/v1/establishment/${establishmentId}/details`,
      cookie: cookie.toString(),
      revalidateTags: [`establishmentId=${establishmentId}`],
    });

    console.log(establishmentData);
    if (response.status != 200)
      throw new FetchError({
        message: establishmentData.message,
        action: establishmentData.action,
        status_code: response.status,
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
          {/* <LastRegistersByEstablishment
              title="Últimos registros"
              maxRegisters={7}
            />
            <LocationCard
              className="w-full flex-1 min-h-[300px]"
              establishmentId={establishmentId}
              markerPosition={{ lat: -15.12345, lng: -45.54321 }}
            /> */}
        </div>
      </div>
    );
  }
}
