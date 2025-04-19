"use client";
//hero ui
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

//components
import { EmailDataIcon } from "../DataIcons/EmailDataIcon";
import { CpfDataIcon } from "../DataIcons/CpfDataIcon";
import { UpdateWorkerModal } from "../WorkersTable/UpdateWorkerModal";
import { PhoneDataIcon } from "../DataIcons/PhoneDataIcon";
import { UserNameDataIcon } from "../DataIcons/UserNameDataIcon";

// getter
import { IWorker } from "../../manager/worker/[workerId]/getWorker";

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
