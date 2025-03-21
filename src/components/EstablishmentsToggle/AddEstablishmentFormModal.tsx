import { useState, useEffect, FocusEvent } from "react";

//hero iu components
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

//components
import { Map } from "../Map/Map";
import { ModalForm } from "../Modal/ModalForm";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "@/src/utils/cep";

//errors
import { FetchError, InputError } from "@/src/Errors/errors";

interface IAddressResponse {
  address: string;
  address_name: string;
  address_type: string;
  cep: string;
  city: string;
  city_ibge: string;
  ddd: string;
  district: string;
  lat: string;
  lng: string;
  state: string;
}

interface IAddEstablishmentFormModal {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export const AddEstablishmentFormModal = ({
  isOpen,
  onOpenChange,
}: IAddEstablishmentFormModal) => {
  const [address, setAddress] = useState<IAddressResponse>({
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
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setAddress((prevState) => ({
          ...prevState,
          lat: `${position.coords.latitude}`,
          lng: `${position.coords.longitude}`,
        }));
      });
    }
  }, []);

  const fetchCepInfos = async (e: FocusEvent<HTMLInputElement, Element>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cep/${e.target.value}`,
    );

    const data = await response.json();

    if (!data.address) {
      addToast({
        title: data.message,
        description: data.action,
        color: "danger",
      });

      return;
    }
    setAddress(data.address);
  };

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
          lat: address.lat,
          lng: address.lng,
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
      <Input
        isRequired
        errorMessage="CEP é obrigatório"
        label="Cep: "
        labelPlacement="outside"
        name="cep"
        placeholder="Digite o cep do estabelecimento"
        type="text"
        onBlur={fetchCepInfos}
      />
      <Input
        isRequired
        disabled
        label="Endereço: "
        labelPlacement="outside"
        name="address"
        placeholder="Endereço do estabelecimento..."
        type="text"
        value={address.address}
        variant="underlined"
      />
      <Input
        isRequired
        disabled
        label="Estado: "
        labelPlacement="outside"
        name="state"
        placeholder="Estado do estabelecimento..."
        type="text"
        variant="underlined"
        value={address.state}
      />
      <Input type="hidden" name="lat" value={address.lat} />

      <Input type="hidden" name="lng" value={address.lng} />

      <h1 className="text-xl">Clique no mapa para selecionar o local:</h1>
      <Map
        className="w-full h-[500px]"
        markerPosition={
          address.lat && address.lng
            ? {
                latitude: Number(address.lat),
                longitude: Number(address.lng),
              }
            : undefined
        }
        onPress={(pos) => {
          setAddress((prevState) => ({
            ...prevState,
            lat: `${pos.Lat}`,
            lng: `${pos.Lng}`,
          }));
        }}
      />
    </ModalForm>
  );
};
