"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { EmailDataIcon } from "../DataIcons/EmailDataIcon";
import { CpfDataIcon } from "../DataIcons/CpfDataIcon";
import { Button } from "@heroui/button";
import { EditIcon } from "@/assets/icons/EditIcon";

export const WorkerInfoCard = () => {
  return (
    <Card className="min-h-min">
      <CardHeader className="flex justify-between items-center">
        <h1 className="text-2xl">DiogoAlberto</h1>
        <Button
          startContent={<EditIcon className="h-5 w-5 stroke-primary-500" />}
          isIconOnly
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <EmailDataIcon email="dafgo03@gmail.com" />
        <CpfDataIcon cpf="071.568.171-08" />
      </CardBody>
    </Card>
  );
};
