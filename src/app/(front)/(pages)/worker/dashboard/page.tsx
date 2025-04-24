import { auth } from "@/auth";

// components
import { EstablishmentInfoCard } from "@/src/app/(front)/components/Cards/EstablishmentInfoCard/EstablishmentInfoCard";
import { WorkersTable } from "@/src/app/(front)/components/Tables/WorkersTable/WorkersTable";
import { LastRegistersByEstablishment } from "../../../components/Tables/LastRegistersByEstablishment";
import { Unauthorized } from "../../../components/Unauthorized";

// hooks
import { getWorkerDetails } from "../../../hooks/getWorkerDetails";

export default async function ManagerDashboard() {
  const session = await auth();

  if (!session || !session.user) return <Unauthorized />;

  const { worker } = await getWorkerDetails(session.user.id);

  return (
    <div className="w-full h-full max-h-full overflow-auto p-5 md:p-10 flex flex-col lg:flex-row gap-4">
      {/* Coluna da esquerda */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        <EstablishmentInfoCard
          id={worker.establishment_id}
          name="Estabelecimento 1"
          phone="(61)98654-8270"
          email="estabelecimento1@email.com"
          cep="71805-703"
          isEditable={false}
        />
        <WorkersTable
          establishmentId={worker.establishment_id}
          isWorkerEditable={false}
          baseRoute="/worker/worker"
        />
      </div>

      {/* Coluna da direita */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        <LastRegistersByEstablishment
          title="Últimos registros"
          establishmentId={worker.establishment_id}
          maxRegisters={7}
        />
      </div>
    </div>
  );
}
