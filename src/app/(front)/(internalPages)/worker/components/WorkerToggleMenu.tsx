"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

//next auth
import { signOut } from "next-auth/react";

//heroui components
import { Listbox, ListboxItem } from "@heroui/react";

//custom components
import { ToggleMenu } from "@/src/app/(front)/components/ToggleMenu/ToggleMenu";
import { usePwaInstallContext } from "../../../components/Pwa/PwaInstallContext";

export const WorkerToggleMenu = ({ isManager }: { isManager: boolean }) => {
  const router = useRouter();
  const pathName = usePathname();

  //verify if is running demo verison
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo");
  const isDemo = demo?.toString().toLowerCase() === "true";

  const [selectedKeys, setSelectedKeys] = useState(new Set([pathName]));

  const { setIsPwaInstallDismissed } = usePwaInstallContext();

  const generateHref = (href: string) => {
    if (isDemo) return `${href}?demo=true`;
    else return href;
  };
  return (
    <ToggleMenu>
      <Listbox
        className={`overflow-auto w-full h-full px-1 py-2`}
        aria-label="Listbox menu with icons"
        variant="shadow"
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) =>
          setSelectedKeys(new Set(keys as Set<string>))
        }
      >
        <ListboxItem
          className="border-b-1 border-primary-100"
          as="a"
          href={generateHref("/worker")}
          key="/worker"
          color="primary"
        >
          Registrar Ponto
        </ListboxItem>

        <ListboxItem
          className="border-b-1 border-primary-100"
          as="a"
          href={generateHref("/worker/timeSheet")}
          key="/worker/timeSheet"
          color="primary"
        >
          Folha de ponto
        </ListboxItem>

        <ListboxItem
          className="border-b-1 border-primary-100"
          as="a"
          href={generateHref("/worker/updateInfos")}
          key="/worker/updateInfos"
          color="primary"
        >
          Alterar meus dados
        </ListboxItem>

        <ListboxItem
          as="a"
          href={generateHref("/worker/dashboard")}
          key="/worker/dashboard"
          color="primary"
          className={`${!isManager && "hidden"}`}
        >
          Painel do gerente
        </ListboxItem>

        <ListboxItem
          className="border-b-1 border-primary-100"
          onPress={() => {
            setIsPwaInstallDismissed(false);
            router.refresh();
          }}
          color="primary"
        >
          Habilitar Instalação
        </ListboxItem>
        <ListboxItem
          onPress={() => {
            if (isDemo) {
              router.push("/");
            } else {
              signOut();
            }
          }}
          key="delete"
          className="text-white bg-danger"
        >
          Sair
        </ListboxItem>
      </Listbox>
    </ToggleMenu>
  );
};
