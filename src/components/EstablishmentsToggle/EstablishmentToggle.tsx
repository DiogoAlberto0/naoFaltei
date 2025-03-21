"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// hero ui components
import { Listbox, ListboxItem, useDisclosure } from "@heroui/react";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";
import { ToggleMenu } from "../ToggleMenu/ToggleManu";

interface IEstablishmentProps {
  id: string;
  name: string;
}

const renderItem = (
  { id, name }: IEstablishmentProps,
  router: AppRouterInstance,
) => {
  return (
    <ListboxItem
      onPress={() =>
        router.replace(`/manager/dashboard?establishmentId=${id}`, {
          scroll: false,
        })
      }
      key={id}
    >
      {name}
    </ListboxItem>
  );
};
export const EstablishmentToggle = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [establishments, setEstablishments] = useState<IEstablishmentProps[]>(
    [],
  );

  const router = useRouter();

  const items = establishments.map((establishment) =>
    renderItem(establishment, router),
  );

  useEffect(() => {
    const fetchEstablishments = async () => {
      const establishments = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/establishment/list`,
      );

      const data = await establishments.json();

      setEstablishments(data.establishments);
    };

    fetchEstablishments();
  }, []);
  return (
    <ToggleMenu>
      <Listbox
        className={`overflow-auto w-full h-full px-1 py-2 `}
        aria-label="Listbox menu with icons"
        variant="shadow"
      >
        <>{items}</>
        <ListboxItem
          onPress={onOpen}
          key="delete"
          className="text-success"
          color="success"
        >
          Adicionar Estabelecimento
        </ListboxItem>
      </Listbox>
      <AddEstablishmentFormModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </ToggleMenu>
  );
};
