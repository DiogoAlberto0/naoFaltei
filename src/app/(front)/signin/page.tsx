import { GoogleSigninButton } from "@/src/app/(front)/components/GoogleSigninButton";

import Image from "next/image";

import workersBackground from "@/assets/workersBackground.jpg";
import { ThemeSwitcher } from "@/src/app/(front)/components/ThemeSwitcher";
import { Divider } from "@heroui/react";
import { CredentialsSigninForm } from "@/src/app/(front)/components/CredentialsSigninForm/CredentialsSigninForm";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SigninForm = ({
  error,
  className,
}: {
  className?: string;
  error: string | string[] | undefined;
}) => {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold">Faça login</h1>
      <Divider className="my-4" />

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold ">
            Você é gerente de um estabelecimento?
          </h2>
          <h3 className="text-base text-secondary-500 font-bold ">
            Faça login aqui!
          </h3>
        </div>
        <GoogleSigninButton />
      </div>

      <Divider className="my-4 " />

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold ">Ou você é um funcionário?</h2>
          <h3 className="text-base text-secondary-500 font-bold">
            Entre por aqui!
          </h3>
        </div>
        <CredentialsSigninForm invalidCredentialsError={error != undefined} />
      </div>
    </div>
  );
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  return (
    <div className="h-screen flex relative">
      <div className="w-3/5 flex justify-center items-center max-sm:absolute max-sm:w-full max-sm:h-full">
        <SigninForm
          className="max-sm:bg-content1 p-5 opacity-95"
          error={error}
        />
      </div>

      <div className="w-2/5 max-sm:w-full">
        <Image
          src={workersBackground}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <ThemeSwitcher className="absolute bottom-6 right-6 z-30" />
    </div>
  );
}
