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

const fakeData: IEstablishmentProps[] = [
  {
    id: "123",
    name: "Estabelecimento 1",
  },
];

const ToggleItems = ({
  activeEstablishmentId,
  establishments,
  isDemo = false,
}: {
  activeEstablishmentId: string | null;
  establishments: IEstablishmentProps[];
  isDemo?: boolean;
}) => {
  return establishments.map(({ id, name }) => (
    <ToggleItem
      key={id}
      href={`/manager/dashboard?establishmentId=${id}${isDemo ? "&demo=true" : ""}`}
      isActive={activeEstablishmentId == id}
      className={`w-full border-b-1 border-primary-100 ${activeEstablishmentId == id && "bg-secondary"}`}
    >
      {name}
    </ToggleItem>
  ));
};
export const EstablishmentToggle = () => {
  const searchParams = useSearchParams();

  const demo = searchParams.get("demo");
  const isDemo = demo?.toString().toLowerCase() === "true";

  const { data, isLoading, error, mutate } = useSWR<IData, IError>(
    isDemo ? null : `/api/v1/establishment/list`,
    fetcher,
  );

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
        {isDemo ? (
          <ToggleItems
            isDemo={isDemo}
            activeEstablishmentId={establishmentId}
            establishments={fakeData}
          />
        ) : (
          <ToggleItems
            isDemo={isDemo}
            activeEstablishmentId={establishmentId}
            establishments={data?.establishments || []}
          />
        )}
        <AddEstablishmentFormModal
          isDemo={isDemo}
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
