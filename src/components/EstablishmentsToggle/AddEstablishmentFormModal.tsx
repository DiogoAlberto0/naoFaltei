import { useState, useEffect, FocusEvent, FormEvent } from "react";

//hero iu components
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import {
  ModalProps,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";

//components
import { Map } from "../Map/Map";
import { phoneUtils } from "@/src/utils/phone";
import { InputError } from "@/src/Errors/errors";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "@/src/utils/cep";
import { addToast } from "@heroui/toast";

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
export const AddEstablishmentFormModal = (
  props: Omit<ModalProps, "children">,
) => {
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
      `http://localhost:3000/api/v1/cep/${e.target.value}`,
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o envio tradicional do formulário

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const name = formData.get("name");

      const phone = formData.get("phone");
      if (!phone || !phoneUtils.isValid(phone?.toString()))
        throw new InputError({
          message: "Telefone inválido",
          action:
            "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
        });
      const email = formData.get("email");
      if (!email || !emailUtils.isValid(email?.toString()))
        throw new InputError({
          message: "Email inválido",
          action:
            "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
        });
      const cep = formData.get("cep");
      if (!cep || !cepUtils.isValid(cep?.toString()))
        throw new InputError({
          message: "CEP inválido",
          action:
            "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
        });

      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
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

      if (response.status !== 201) {
        addToast({
          title: data.message,
          description: data.action,
          color: "danger",
        });
      } else {
        addToast({
          title: `Empresa ${data.name} criada com sucesso`,
          color: "success",
        });
        form.reset();
      }
    } catch (error) {
      if (error instanceof InputError)
        addToast({
          title: error.message,
          description: error.action,
          color: "danger",
        });
      else throw error;
    }
  };

  return (
    <Modal size="4xl" className="max-h-[80vh] overflow-auto" {...props}>
      <Form onSubmit={handleSubmit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Criar um novo estabelecimento
              </ModalHeader>
              <ModalBody>
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

                <h1 className="text-xl">
                  Clique no mapa para selecionar o local:
                </h1>
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Criar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
};
