import { useState, useEffect, ReactNode } from "react";

//hero iu components
import { Input } from "@heroui/input";

//components
import { Map } from "../Map/Map";
import { ModalForm } from "../Modal/ModalForm";
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
  openButton: (props: { onPress: () => void }) => ReactNode;
}
export const AddEstablishmentFormModal = ({
  openButton,
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
      handleSubmit={handleSubmit}
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

      <h1 className="text-xl">Clique no mapa para selecionar o local:</h1>
      <Map
        className="w-full h-[500px]"
        markerPosition={
          addressState.lat && addressState.lng
            ? {
                latitude: Number(addressState.lat),
                longitude: Number(addressState.lng),
              }
            : undefined
        }
        onPress={(pos) => {
          setAddressState((prevState) => ({
            ...prevState,
            lat: `${pos.Lat}`,
            lng: `${pos.Lng}`,
          }));
        }}
      />
    </ModalForm>
  );
};
