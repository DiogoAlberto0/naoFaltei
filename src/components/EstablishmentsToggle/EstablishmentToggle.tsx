"use client";
import { ReactNode, useState } from "react";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

const ListboxItems = Array.from({ length: 30 }, (_, i) => i);
export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full h-full max-h-full overflow-auto max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
export const EstablishmentToggle = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative flex h-full items-center">
      {/* Botão para abrir/fechar */}

      {/* Menu lateral */}

      {isOpen && (
        <ListboxWrapper>
          <Listbox aria-label="Listbox menu with icons" variant="faded">
            <>
              {ListboxItems.map((i) => (
                <ListboxItem key={i}>Estabelecimento {i}</ListboxItem>
              ))}
            </>
            <ListboxItem key="delete" className="text-success" color="success">
              Adicionar Estabelecimento
            </ListboxItem>
          </Listbox>
        </ListboxWrapper>
      )}

      <Button color="primary" onPress={() => setIsOpen(!isOpen)} isIconOnly>
        {isOpen ? (
          <ArrowIcon direction="left" />
        ) : (
          <ArrowIcon direction="right" />
        )}
      </Button>
    </div>
  );
};
