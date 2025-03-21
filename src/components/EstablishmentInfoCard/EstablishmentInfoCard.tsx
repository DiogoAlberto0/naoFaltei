"use client";
// icons
import { EditIcon } from "@/assets/icons/EditIcon";

// heroui components
import {
  Button,
  Divider,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useDisclosure,
} from "@heroui/react";

// component
import { CepDataIcon } from "@/src/components/DataIcons/CepDataIcon";
import { EmailDataIcon } from "@/src/components/DataIcons/EmailDataIcon";
import { PhoneDataIcon } from "@/src/components/DataIcons/PhoneDataIcon";
import { UpdateEstablishmentModal } from "./UpdateEstablishmentModal";

export const EstablishmentInfoCard = ({
  id,
  name,
  cep,
  email,
  phone,
}: {
  id: string;
  name: string;
  phone: string;
  email: string;
  cep: string;
}) => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

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
      <Divider />
      <CardFooter className="flex justify-end">
        <Button
          startContent={<EditIcon className="h-5 w-5 stroke-primary-500" />}
          onPress={onOpen}
        >
          Editar
        </Button>
      </CardFooter>

      <UpdateEstablishmentModal
        id={id}
        name={name}
        phone={phone}
        email={email}
        cep={cep}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </Card>
  );
};
