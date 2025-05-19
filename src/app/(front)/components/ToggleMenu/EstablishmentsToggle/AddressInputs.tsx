//react
import { Dispatch, SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

//heroui components
import { Input } from "@heroui/react";

// components
const Map = dynamic(() => import("../../Map/Map").then((mod) => mod.Map), {
  ssr: false, // <-- força a renderização apenas no cliente
});
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
  const [ratio, setRatio] = useState(500);

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
        description="A localização inicial é baseada no CEP"
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

      <Input
        isRequired
        label="Distância Máxima para Registro (Metros):"
        labelPlacement="outside"
        name="ratio"
        placeholder="Ex: 500 - Funcionário poderá registrar o ponto até 500 metros do estabelecimento"
        type="number"
        onValueChange={(value) => setRatio(Number(value))}
        value={String(ratio)}
        tabIndex={8}
      />

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
        markerRadius={ratio}
        onPress={(pos) => {
          setAddress((prevState) => ({
            ...prevState,
            lat: `${pos.Lat}`,
            lng: `${pos.Lng}`,
          }));
        }}
      />
    </>
  );
};
