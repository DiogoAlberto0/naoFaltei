"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// hero ui components
import { Listbox, ListboxItem, useDisclosure } from "@heroui/react";

// icons
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
  const [isOpenToggle, setIsOpenToggle] = useState(true);
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
    <div
      className={`
        border-small border-default-200 dark:border-default-100 rounded-r-small
        bg-primary bg-opacity-50 hover:bg-opacity-90
        absolute z-20 bottom-0
        max-sm:w-full
        flex flex-col-reverse
        sm:h-[calc(100vh-4rem)] sm:flex-row
        transition-all duration-500 ease-in-out 
        ${isOpenToggle ? "h-[calc(100vh-4rem)] sm:w-[250px]" : "h-12 sm:w-12"}
        `}
    >
      {isOpenToggle && (
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
      )}

      <AddEstablishmentFormModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <button
        onClick={() => setIsOpenToggle(!isOpenToggle)}
        className=" flex justify-center items-center w-full h-12 sm:h-full sm:w-12"
      >
        {isOpenToggle ? (
          <>
            <ArrowIcon direction="down" className="sm:hidden" />
            <ArrowIcon direction="left" className="max-sm:hidden" />
          </>
        ) : (
          <>
            <ArrowIcon direction="top" className="sm:hidden" />
            <ArrowIcon direction="right" className="max-sm:hidden" />
          </>
        )}
      </button>
    </div>
  );
};
