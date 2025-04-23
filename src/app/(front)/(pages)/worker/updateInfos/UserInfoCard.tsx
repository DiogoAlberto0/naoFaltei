"use client";

// hero ui
import { Card, CardBody } from "@heroui/react";

//components
import { EmailDataIcon } from "../../../components/DataViews/DataIcons/EmailDataIcon";
import { UserNameDataIcon } from "../../../components/DataViews/DataIcons/UserNameDataIcon";
import { CpfDataIcon } from "../../../components/DataViews/DataIcons/CpfDataIcon";
import { PhoneDataIcon } from "../../../components/DataViews/DataIcons/PhoneDataIcon";

interface UserInfoCardProps {
  name: string;
  email: string;
  login: string;
  cpf: string;
  phone: string;
}

export const UserInfoCard = ({
  name,
  email,
  login,
  cpf,
  phone,
}: UserInfoCardProps) => {
  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md">
      <CardBody className="p-6 flex flex-col gap-4 text-sm text-gray-800 dark:text-gray-100">
        <h2 className="text-lg font-semibold text-center text-zinc-800 dark:text-white">
          {name}
        </h2>

        <EmailDataIcon email={email} />

        <UserNameDataIcon username={login} />

        <CpfDataIcon cpf={cpf} />

        <PhoneDataIcon phone={phone} />
      </CardBody>
    </Card>
  );
};
