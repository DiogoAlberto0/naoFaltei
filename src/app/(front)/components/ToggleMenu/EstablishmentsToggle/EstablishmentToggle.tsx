"use client";
import { useSearchParams } from "next/navigation";

// hero ui components
import { Button } from "@heroui/react";

// components
import { AddEstablishmentFormModal } from "./AddEstablishmentFormModal";
import { ToggleMenu } from "../ToggleMenu";
import { AddIcon } from "@/assets/icons/AddIcon";
import { ToggleItem } from "./EstablishmentToggleItem";
import { ComponentError } from "../../ComponentError";

// fetcher
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";

interface IEstablishmentProps {
  id: string;
  name: string;
}
interface IData {
  establishments: IEstablishmentProps[];
}
interface IError {
  message: string;
  action: string;
}
export const EstablishmentToggle = () => {
  const { data, isLoading, error, mutate } = useSWR<IData, IError>(
    `/api/v1/establishment/list`,
    fetcher,
  );

  const searchParams = useSearchParams();
  const establishmentId = searchParams.get("establishmentId"); // retorna "123"

  return (
    <ToggleMenu>
      <div className=" w-full h-full flex flex-col overflow-auto gap-1">
        {error && (
          <ComponentError message={error.message} action={error.action} />
        )}
        {isLoading && (
          <ToggleItem
            href=""
            className={`w-full border-b-1 border-primary-100`}
          >
            Carregando...
          </ToggleItem>
        )}
        {data?.establishments.map(({ id, name }) => (
          <ToggleItem
            key={id}
            href={`/manager/dashboard?establishmentId=${id}`}
            isActive={establishmentId == id}
            className={`w-full border-b-1 border-primary-100 ${establishmentId == id && "bg-secondary"}`}
          >
            {name}
          </ToggleItem>
        ))}
        <AddEstablishmentFormModal
          onAdd={() => mutate()}
          openButton={({ onPress }) => (
            <Button
              onPress={onPress}
              variant="shadow"
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
