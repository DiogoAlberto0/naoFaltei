"use client";
// heroui components
import { Divider, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

// component
import { CepDataIcon } from "@/src/app/(front)/components/DataViews/DataIcons/CepDataIcon";
import { EmailDataIcon } from "@/src/app/(front)/components/DataViews/DataIcons/EmailDataIcon";
import { PhoneDataIcon } from "@/src/app/(front)/components/DataViews/DataIcons/PhoneDataIcon";
import { UpdateEstablishmentModal } from "./UpdateEstablishmentModal";

export const EstablishmentInfoCard = ({
  id,
  name,
  cep,
  email,
  phone,
  isEditable = true,
}: {
  id: string;
  name: string;
  phone: string;
  email: string;
  cep: string;
  isEditable?: boolean;
}) => {
  return (
    <Card className="flex flex-col min-h-max">
      <CardHeader className="flex gap-3">
        <h1 className="text-xl">Informações</h1>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-1 overflow-visible">
        <p className="text-md">Nome: {name}</p>
        <PhoneDataIcon phone={phone} />
        <EmailDataIcon email={email} />
        <CepDataIcon cep={cep} />
      </CardBody>
      {isEditable && (
        <>
          <Divider />
          <CardFooter className="flex justify-end">
            <UpdateEstablishmentModal
              id={id}
              name={name}
              phone={phone}
              email={email}
              cep={cep}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
};
