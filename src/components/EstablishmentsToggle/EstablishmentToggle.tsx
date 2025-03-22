"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// hero ui components
import { Listbox, ListboxItem, useDisclosure } from "@heroui/react";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";
import { ToggleMenu } from "../ToggleMenu/ToggleMenu";
import { AddIcon } from "@/assets/icons/AddIcon";

interface IEstablishmentProps {
  id: string;
  name: string;
}

interface IListboxItemProps {
  establishmentProps: IEstablishmentProps;
  router: AppRouterInstance;
  showDivider?: boolean;
}
const renderItem = ({
  establishmentProps: { id, name },
  router,
  showDivider = false,
}: IListboxItemProps) => {
  return (
    <ListboxItem
      showDivider={showDivider}
      onPress={() => {
        router.replace(`/manager/dashboard?establishmentId=${id}`, {
          scroll: false,
        });
      }}
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

  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const router = useRouter();

  const items = establishments.map((establishment, index) =>
    renderItem({
      establishmentProps: establishment,
      router,
      showDivider: index == establishments.length - 1,
    }),
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
    <ToggleMenu hasHeader>
      <Listbox
        className={`overflow-auto w-full h-full px-1 py-2 `}
        aria-label="Listbox menu with icons"
        variant="solid"
        color="primary"
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) =>
          setSelectedKeys(new Set(keys as Set<string>))
        }
      >
        <>{items}</>
        <ListboxItem
          onPress={onOpen}
          key="delete"
          className="text-success"
          color="success"
          startContent={<AddIcon className="h-5 w-5" />}
        >
          Adicionar Estabelecimento
        </ListboxItem>
      </Listbox>
      <AddIcon />
      <AddEstablishmentFormModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </ToggleMenu>
  );
};
