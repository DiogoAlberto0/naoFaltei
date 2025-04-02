import { useState, useEffect } from "react";

//hero iu components
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

//components
import { Map } from "../Map/Map";
import { ModalForm } from "../Modal/ModalForm";
import { AddressInputs, IAddress } from "./AddressInputs";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "@/src/utils/cep";

//errors
import { FetchError, InputError } from "@/src/Errors/errors";

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
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export const AddEstablishmentFormModal = ({
  isOpen,
  onOpenChange,
}: IAddEstablishmentFormModal) => {
  const [addressState, setAddressState] = useState<IAddress>(INITIAL_ADDRESS);

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

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name");

    const phone = formData.get("phone");
    const email = formData.get("email");
    const cep = formData.get("cep");

    if (!name || !phone || !email || !cep)
      throw new InputError({
        message: "Campos obrigatorios faltando",
        action: "Informe o nome, telefone, email e cep do novo estabelecimento",
      });

    phoneUtils.isValidOrThrow(phone.toString());
    emailUtils.isValidOrThrow(email.toString());
    cepUtils.isValidOrThrow(cep.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/establishment/create`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          email,
          cep,
          lat: addressState.lat,
          lng: addressState.lng,
        }),
      },
    );

    const data = await response.json();

    if (response.status !== 201)
      throw new FetchError({
        message: data.message,
        status_code: response.status,
        action: data.action,
      });
    addToast({
      title: `Empresa ${data.name} criada com sucesso`,
      color: "success",
    });
  };

  return (
    <ModalForm
      handleSubmit={handleSubmit}
      submitButtonText="Criar"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
