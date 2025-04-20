"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// hero ui components
import { Button } from "@heroui/react";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";
import { ToggleMenu } from "../ToggleMenu";
import { AddIcon } from "@/assets/icons/AddIcon";
import { ToggleItem } from "./EstablishmentToggleItem";

interface IEstablishmentProps {
  id: string;
  name: string;
}

export const EstablishmentToggle = () => {
  const [establishments, setEstablishments] = useState<IEstablishmentProps[]>(
    [],
  );

  const searchParams = useSearchParams();
  const establishmentId = searchParams.get("establishmentId"); // retorna "123"

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
      <div className=" h-full flex flex-col overflow-auto gap-1">
        {establishments.map(({ id, name }) => (
          <ToggleItem
            key={id}
            href={`/manager/dashboard?establishmentId=${id}`}
            isActive={establishmentId == id}
          >
            {name}
          </ToggleItem>
        ))}
        <AddEstablishmentFormModal
          openButton={({ onPress }) => (
            <Button
              onPress={onPress}
              variant="bordered"
              color="success"
              className="w-full min-h-10"
              startContent={<AddIcon />}
            >
              Adicionar
            </Button>
          )}
        />
      </div>
    </ToggleMenu>
  );
};
