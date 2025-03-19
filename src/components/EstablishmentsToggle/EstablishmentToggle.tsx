"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// hero ui components
import { Listbox, ListboxItem, useDisclosure } from "@heroui/react";

// icons
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";

interface IEstablishmentProps {
  id: string;
  name: string;
}

export const EstablishmentToggle = () => {
  const [isOpenToggle, setIsOpenToggle] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [establishments, setEstablishments] = useState<IEstablishmentProps[]>(
    [],
  );

  const router = useRouter();

  useEffect(() => {
    const fetchEstablishments = async () => {
      const establishments = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
      );

      const data = await establishments.json();

      setEstablishments(data.establishments);
    };

    fetchEstablishments();
  }, []);
  return (
    <div className="h-full relative ">
      <div
        className={`
        border-small border-default-200 dark:border-default-100 
        px-1 py-2 
        rounded-small 
        flex 
        absolute z-50 sm:relative
        h-full 
        bg-content2 bg-opacity-90 
        ${isOpenToggle && "w-screen sm:max-w-[250px]"}
        `}
      >
        {isOpenToggle && (
          <Listbox
            className="overflow-auto w-full"
            aria-label="Listbox menu with icons"
            variant="shadow"
          >
            <>
              {establishments.map(({ id, name }) => (
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
              ))}
            </>
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
        <AddEstablishmentFormModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
        <button
          onClick={() => setIsOpenToggle(!isOpenToggle)}
          className=" flex justify-center items-center sm:px-2"
        >
          {isOpenToggle ? (
            <ArrowIcon direction="left" />
          ) : (
            <ArrowIcon direction="right" />
          )}
        </button>
      </div>
    </div>
  );
};
