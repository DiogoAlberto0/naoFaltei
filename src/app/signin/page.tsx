import { GoogleSigninButton } from "@/src/components/GoogleSigninButton";

import Image from "next/image";

import workersBackground from "@/assets/workersBackground.jpg";
import { ThemeSwitcher } from "@/src/components/ThemeSwitcher";
import { Divider } from "@heroui/react";
import { CredentialsSigninForm } from "@/src/components/CredentialsSigninForm/CredentialsSigninForm";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const leftSideSmStyles = `
  max-md:w-full max-md:h-screen
  max-md:absolute max-md:z-20 
  max-md:bg-opacity-50
`;
const leftSideStyles = `
  bg-background 
  w-3/5 p-10 
  flex gap-6 flex-col justify-center h-sm:justify-normal
  overflow-auto
  max-h-screen
`;
const LeftSide = ({ error }: { error: string | string[] | undefined }) => {
  return (
    <div className={`${leftSideStyles} ${leftSideSmStyles} `}>
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

const rightSideSmStyles = `
  max-md:w-full 
  max-md:relative max-md:z-10
`;
const rightSideStyles = `
  h-full w-2/5 object-cover blur-sm
`;
const RightSide = () => {
  return (
    <Image
      src={workersBackground}
      alt="Background clock image"
      className={`${rightSideSmStyles} ${rightSideStyles}`}
    />
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
      <LeftSide error={error} />

      <RightSide />

      <ThemeSwitcher className="absolute bottom-6 right-6 z-30"></ThemeSwitcher>
    </div>
  );
}
