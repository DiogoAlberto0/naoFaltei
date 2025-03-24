"use client";

import { ToggleMenu } from "@/src/components/ToggleMenu/ToggleMenu";
import { Listbox, ListboxItem } from "@heroui/react";
import { signOut } from "next-auth/react";

export const WorkerToggleMenu = () => {
  return (
    <ToggleMenu>
      <Listbox
        className={`overflow-auto w-full h-full px-1 py-2 `}
        aria-label="Listbox menu with icons"
        variant="shadow"
      >
        <ListboxItem href="/worker" key="a" color="primary">
          Registrar Ponto
        </ListboxItem>

        <ListboxItem href="/worker/timeSheet" key="b" color="primary">
          Folha de ponto
        </ListboxItem>

        <ListboxItem href="/worker/updateInfos" key="c" color="primary">
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
