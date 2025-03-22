"use client";

import { ToggleMenu } from "@/src/components/ToggleMenu/ToggleMenu";
import { Listbox, ListboxItem } from "@heroui/react";

export const WorkerToggleMenu = () => {
  return (
    <ToggleMenu>
      <Listbox
        className={`overflow-auto w-full h-full px-1 py-2 `}
        aria-label="Listbox menu with icons"
        variant="shadow"
      >
        <ListboxItem onPress={() => ``} key="a" color="primary">
          Registrar Ponto
        </ListboxItem>

        <ListboxItem onPress={() => ``} key="b" color="primary">
          Folha de ponto
        </ListboxItem>

        <ListboxItem onPress={() => ``} key="c" color="primary">
          Alterar meus dados
        </ListboxItem>

        <ListboxItem
          onPress={() => ``}
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
