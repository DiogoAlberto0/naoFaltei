import { auth } from "@/auth";

//components
import { EstablishmentInfoCard } from "@/src/app/(front)/components/Cards/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "@/src/app/(front)/components/Tables/WorkersTable/WorkersTable";
import { LocationCard } from "@/src/app/(front)/components/Cards/LocationCard/LocationCard";
import { LastRegistersByEstablishment } from "../../../components/Tables/LastRegistersByEstablishment";
import { Unauthorized } from "../../../components/Unauthorized";
import { CountdownAdModal } from "../../../ADS/Adsterra/CountdownAdModal";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { cepUtils } from "@/src/utils/cep";
import {
  getEstablishmentDetails,
  IEstablishment,
} from "../../../hooks/getEstablishmentDetails";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const fakeEstablishment: IEstablishment = {
  name: "Empresa Exemplo LTDA",
  phone: "(11) 91234-5678",
  email: "contato@empresaexemplo.com",
  cep: "01001-000",
  lat: -23.55052,
  lng: -46.633308,
  ratio: 150, // em metros, por exemplo
};

const SelectEstablishment = () => {
  return (
    <div className="w-full h-full flex justify-center items-center p-4 text-center">
      <h1 className="text-xl">Selecione um estabelecimento...</h1>
    </div>
  );
};
export default async function ManagerDashboard(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  const searchParams = await props.searchParams;

  const demo = searchParams.demo;
  const isDemo = demo?.toString().toLowerCase() === "true";

  if (!isDemo && (!session || !session.user)) return <Unauthorized />;
  const establishmentId = searchParams.establishmentId;

  if (typeof establishmentId != "string") return <SelectEstablishment />;
  else {
    const establishmentData = isDemo
      ? fakeEstablishment
      : await getEstablishmentDetails(establishmentId);

    return (
      <div className="w-full h-full max-h-full overflow-auto p-5 md:p-10 flex flex-col lg:flex-row gap-4">
        <CountdownAdModal />
        {/* Coluna da esquerda */}
        <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
          <EstablishmentInfoCard
            isDemo={isDemo}
            id={establishmentId}
            name={establishmentData.name}
            phone={phoneUtils.format(establishmentData.phone)}
            email={establishmentData.email}
            cep={cepUtils.format(establishmentData.cep)}
          />
          <WorkersTable
            establishmentId={establishmentId}
            baseRoute="/manager/worker"
            isDemo={isDemo}
          />
        </div>

        {/* Coluna da direita */}
        <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
          <LastRegistersByEstablishment
            establishmentId={establishmentId}
            title="Últimos registros"
            maxRegisters={7}
            isDemo={isDemo}
          />

          <LocationCard
            className="w-full flex-1 min-h-[300px]"
            establishmentId={establishmentId}
            markerPosition={{
              lat: establishmentData.lat,
              lng: establishmentData.lng,
            }}
            ratio={establishmentData.ratio}
            isDemo={isDemo}
          />
        </div>
      </div>
    );
  }
}
