import { addToast, Button, Input } from "@heroui/react";
import { useDisclosure } from "@heroui/modal";

//coponents
import { ModalForm } from "../Modal/ModalForm";
import { Map } from "../Map/Map";
import { FetchError, InputError } from "@/src/Errors/errors";
import { useState } from "react";
import { EditIcon } from "@/assets/icons/EditIcon";

interface ICoords {
  lat: number;
  lng: number;
}
interface IUpdateLocaleModalProps {
  establishmentId: string;
  inicialCoords: ICoords;
}

const handleSubmit = async (
  formData: FormData,
  establishmentId: string,
  coords: ICoords,
) => {
  const lat = formData.get("lat");
  const lng = formData.get("lng");

  if (!lat || !lng)
    throw new InputError({
      message: "Coordenadas inválidas",
      action: "Favor selecionar o local do estabelecimento no mapa",
    });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/establishment/${establishmentId}/update`,
    {
      method: "PUT",
      body: JSON.stringify({
        coords: {
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
        },
      }),
    },
  );
  const data = await response.json();

  if (response.status != 200)
    throw new FetchError({
      message: data.message,
      action: data.action,
      status_code: response.status,
    });

  addToast({
    color: "success",
    title: "Localização alterada com sucesso",
  });
};
export const UpdateLocaleModal = ({
  establishmentId,
  inicialCoords,
}: IUpdateLocaleModalProps) => {
  const [coords, setCoords] = useState<ICoords>({
    lat: inicialCoords.lat,
    lng: inicialCoords.lng,
  });

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <Button
        endContent={<EditIcon className="h-5 w-5 stroke-primary-500" />}
        color="primary"
        onPress={onOpen}
      >
        Editar
      </Button>
      <ModalForm
        handleSubmit={(e) => handleSubmit(e, establishmentId, coords)}
        submitButtonText="Salvar"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Mudar a localização do estabelecimento"
      >
        <Map
          className="w-full h-[500px]"
          markerPosition={{
            latitude: coords.lat,
            longitude: coords.lng,
          }}
          onPress={({ Lat, Lng }) => {
            setCoords({ lat: Lat, lng: Lng });
          }}
        />

        <Input name="lat" type="hidden" value={`${coords.lat}`} required />
        <Input name="lng" type="hidden" value={`${coords.lng}`} required />
      </ModalForm>
    </>
  );
};
