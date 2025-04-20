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

// getter
import { IWorker } from "../../../(pages)/manager/worker/[workerId]/getWorker";

export const WorkerInfoCard = ({ worker }: { worker: IWorker }) => {
  return (
    <Card className="min-h-min">
      <CardHeader className="flex justify-between items-center">
        <h1 className="text-2xl">{worker.name}</h1>
        <UpdateWorkerModal worker={worker} />
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
