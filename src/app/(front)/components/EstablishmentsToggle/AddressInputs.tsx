//react
import { Dispatch, SetStateAction, useState } from "react";

//heroui components
import { Input } from "@heroui/react";

export interface IAddress {
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

interface IAddressInputsProps {
  address: IAddress;
  setAddress: Dispatch<SetStateAction<IAddress>>;
}

export const AddressInputs = ({ address, setAddress }: IAddressInputsProps) => {
  const fetchCepInfos = async (cep: string) => {
    setAddress((prevState) => ({ ...prevState, address: "", state: "" }));
    setFetchAddressStatus("warning");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cep/${cep}`,
    );

    const data = await response.json();

    if (!data.address) {
      setFetchAddressStatus("danger");
    } else {
      setAddress(data.address);
      setFetchAddressStatus("success");
    }
  };

  const [fetchAddressStatus, setFetchAddressStatus] = useState<
    "default" | "warning" | "danger" | "success"
  >("default");

  const addressPlaceholder = {
    default: "Endereço do estabelecimento...",
    warning: "Buscando endereço do estabelecimento, aguarde!",
    danger: "Falha ao buscar endereço, digite manualmente",
    success: "",
  };
  return (
    <>
      <Input
        isRequired
        label="CEP: "
        labelPlacement="outside"
        name="cep"
        placeholder="Digite o CEP"
        type="text"
        onValueChange={(value) => value.length >= 8 && fetchCepInfos(value)}
        tabIndex={4}
      />
      <Input
        disabled={
          fetchAddressStatus === "warning" || fetchAddressStatus === "default"
        }
        color={fetchAddressStatus}
        isRequired
        label="Endereço: "
        labelPlacement="outside"
        name="address"
        placeholder={addressPlaceholder[fetchAddressStatus]}
        type="text"
        value={address.address}
        onChange={(e) =>
          setAddress((prev) => ({ ...prev, address: e.target.value }))
        }
        tabIndex={6}
      />
      <Input
        disabled={
          fetchAddressStatus === "warning" || fetchAddressStatus === "default"
        }
        color={fetchAddressStatus}
        isRequired
        label="Estado: "
        labelPlacement="outside"
        name="state"
        placeholder={addressPlaceholder[fetchAddressStatus]}
        type="text"
        value={address.state}
        onChange={(e) =>
          setAddress((prev) => ({ ...prev, state: e.target.value }))
        }
        tabIndex={7}
      />

      <Input
        isRequired
        label="Número: "
        labelPlacement="outside"
        name="number"
        placeholder="Estado do estabelecimento..."
        type="number"
        tabIndex={5}
      />
    </>
  );
};
