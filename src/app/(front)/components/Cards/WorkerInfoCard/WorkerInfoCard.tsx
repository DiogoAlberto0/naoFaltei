"use client";
//hero ui
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

//components
import { EmailDataIcon } from "../../DataViews/DataIcons/EmailDataIcon";
import { CpfDataIcon } from "../../DataViews/DataIcons/CpfDataIcon";
import { UpdateWorkerModal } from "../../Tables/WorkersTable/UpdateWorkerModal";
import { PhoneDataIcon } from "../../DataViews/DataIcons/PhoneDataIcon";
import { UserNameDataIcon } from "../../DataViews/DataIcons/UserNameDataIcon";

// worker fetcher
import { IWorker } from "../../../hooks/worker/worker.type";

export const WorkerInfoCard = ({
  worker,
  isDemo = false,
}: {
  worker: IWorker;
  isDemo?: boolean;
}) => {
  return (
    <Card className="min-h-min">
      <CardHeader className="flex justify-between items-center">
        <h1 className="text-2xl">{worker.name}</h1>
        <UpdateWorkerModal worker={worker} isDemo={isDemo} />
      </CardHeader>
      <Divider />
      <CardBody>
        <EmailDataIcon email={worker.email} />
        <CpfDataIcon cpf={worker.cpf} />
        <PhoneDataIcon phone={worker.phone} />
        <UserNameDataIcon username={worker.login} />
      </CardBody>
    </Card>
  );
};
