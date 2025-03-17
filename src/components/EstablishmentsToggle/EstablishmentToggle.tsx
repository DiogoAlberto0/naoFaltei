"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// hero ui components
import { Button, Listbox, ListboxItem, useDisclosure } from "@heroui/react";

// icons
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";

interface IEstablishmentProps {
  id: string;
  name: string;
}

export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full h-full max-h-full overflow-hidden flex max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
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
    <div className="relative flex h-full items-center">
      <ListboxWrapper>
        {isOpenToggle && (
          <Listbox
            className="overflow-auto"
            aria-label="Listbox menu with icons"
            variant="faded"
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
        <Button
          color="primary"
          variant="faded"
          onPress={() => setIsOpenToggle(!isOpenToggle)}
          isIconOnly
          className="mx-1"
        >
          {isOpenToggle ? (
            <ArrowIcon direction="left" />
          ) : (
            <ArrowIcon direction="right" />
          )}
        </Button>
      </ListboxWrapper>
    </div>
  );
};
