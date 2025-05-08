"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

//next auth
import { signOut } from "next-auth/react";

//heroui components
import { Listbox, ListboxItem } from "@heroui/react";

//custom components
import { ToggleMenu } from "@/src/app/(front)/components/ToggleMenu/ToggleMenu";
import { usePwaInstallContext } from "../../../components/Pwa/PwaInstallContext";

export const WorkerToggleMenu = () => {
  const router = useRouter();
  const pathName = usePathname();

  const [selectedKeys, setSelectedKeys] = useState(new Set([pathName]));

  const { setIsPwaInstallDismissed } = usePwaInstallContext();

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
          onPress={() => {
            router.push(`/worker`, {
              scroll: false,
            });
          }}
          key="/worker"
          color="primary"
        >
          Registrar Ponto
        </ListboxItem>

        <ListboxItem
          className="border-b-1 border-primary-100"
          onPress={() => {
            router.push(`/worker/timeSheet`, {
              scroll: false,
            });
          }}
          key="/worker/timeSheet"
          color="primary"
        >
          Folha de ponto
        </ListboxItem>

        <ListboxItem
          className="border-b-1 border-primary-100"
          onPress={() => {
            router.push(`/worker/updateInfos`, {
              scroll: false,
            });
          }}
          key="/worker/updateInfos"
          color="primary"
        >
          Alterar meus dados
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
            router.push(`/worker/dashboard`, {
              scroll: false,
            });
          }}
          key="/worker/dashboard"
          color="primary"
        >
          Painel do gerente
        </ListboxItem>

        <ListboxItem
          onPress={() => {
            signOut();
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
