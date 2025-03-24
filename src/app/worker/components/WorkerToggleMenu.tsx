"use client";

import { ToggleMenu } from "@/src/components/ToggleMenu/ToggleMenu";
import { Listbox, ListboxItem } from "@heroui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const WorkerToggleMenu = () => {
  const router = useRouter();

  const [selectedKeys, setSelectedKeys] = useState(new Set(["clockin"]));

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
          onPress={() => {
            router.replace(`/worker`, {
              scroll: false,
            });
          }}
          key="clockin"
          color="primary"
        >
          Registrar Ponto
        </ListboxItem>

        <ListboxItem
          onPress={() => {
            router.replace(`/worker/timeSheet`, {
              scroll: false,
            });
          }}
          key="timeSheet"
          color="primary"
        >
          Folha de ponto
        </ListboxItem>

        <ListboxItem
          onPress={() => {
            router.replace(`/worker/updateInfos`, {
              scroll: false,
            });
          }}
          key="updateInfos"
          color="primary"
        >
          Alterar meus dados
        </ListboxItem>

        <ListboxItem
          onPress={() => {
            signOut();
          }}
          key="delete"
          className="text-danger"
          color="danger"
          variant="shadow"
        >
          Sair
        </ListboxItem>
      </Listbox>
    </ToggleMenu>
  );
};
