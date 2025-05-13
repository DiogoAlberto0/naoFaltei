import { useState, useEffect, ReactNode } from "react";

//hero iu components
import { Input } from "@heroui/input";

//components

import { ModalForm } from "@/src/app/(front)/components/Modal/ModalForm";
import { AddressInputs, IAddress } from "./AddressInputs";

//hook
import { useCreateEstablishment } from "./useCreateEstablishment";

const INITIAL_ADDRESS: IAddress = {
  address: "",
  address_name: "",
  address_type: "",
  cep: "",
  city: "",
  city_ibge: "",
  ddd: "",
  district: "",
  lat: "",
  lng: "",
  state: "",
};

interface IAddEstablishmentFormModal {
  onAdd: () => void;
  openButton: (props: { onPress: () => void }) => ReactNode;
}
export const AddEstablishmentFormModal = ({
  openButton,
  onAdd,
}: IAddEstablishmentFormModal) => {
  const [addressState, setAddressState] = useState<IAddress>(INITIAL_ADDRESS);

  const { handleSubmit } = useCreateEstablishment();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setAddressState((prevState) => ({
          ...prevState,
          lat: `${position.coords.latitude}`,
          lng: `${position.coords.longitude}`,
        }));
      });
    }
  }, []);

  return (
    <ModalForm
      handleSubmit={async (e) => {
        await handleSubmit(e);
        onAdd();
      }}
      submitButtonText="Criar"
      openButton={openButton}
    >
      <Input
        isRequired
        errorMessage="Nome é obrigatório"
        label="Nome: "
        labelPlacement="outside"
        name="name"
        placeholder="Digite o nome do estabelecimento"
        type="text"
      />
      <Input
        isRequired
        errorMessage="Telefone é obrigatório"
        label="Telefone: "
        labelPlacement="outside"
        name="phone"
        placeholder="Digite o telefone do estabelecimento"
        type="phone"
      />
      <Input
        isRequired
        errorMessage="Email é obrigatório"
        label="Email: "
        labelPlacement="outside"
        name="email"
        placeholder="Digite o email do estabelecimento"
        type="email"
      />

      <AddressInputs address={addressState} setAddress={setAddressState} />

      <Input type="hidden" name="lat" value={addressState.lat} />

      <Input type="hidden" name="lng" value={addressState.lng} />
    </ModalForm>
  );
};
