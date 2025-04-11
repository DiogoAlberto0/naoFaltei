import { addToast, Button, Input } from "@heroui/react";

//coponents
import { ModalForm } from "../Modal/ModalForm";
import { Map } from "../Map/Map";
import { InputError } from "@/src/Errors/errors";
import { useState } from "react";
import { EditIcon } from "@/assets/icons/EditIcon";
import { coordinateUtils } from "@/src/utils/coordinate";
import { axios } from "@/src/utils/fetcher";

interface ICoords {
  lat: number;
  lng: number;
}
interface IUpdateLocaleModalProps {
  establishmentId: string;
  inicialCoords: ICoords;
  ratio: number;
}

interface IUpdateLocaleResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  cep: string;
  lat: number;
  lng: number;
  ratio: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
}
{
}

const handleSubmit = async (formData: FormData) => {
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const ratio = Number(formData.get("ratio"));

  console.log(ratio);
  const establishmentId = formData.get("establishmentId");

  if (!lat || !lng)
    throw new InputError({
      message: "Coordenadas inválidas",
      action: "Favor selecionar o local do estabelecimento no mapa",
    });

  coordinateUtils.isValidOrThrow({
    lat,
    lng,
  });

  const { data } = await axios<IUpdateLocaleResponse>({
    route: `/api/v1/establishment/${establishmentId}/update`,
    method: "PUT",
    body: {
      coords: {
        lat,
        lng,
      },
      ratio,
    },
  });

  console.log({ data });
  addToast({
    color: "success",
    title: `Localização da empresa ${data.name} alterada com sucesso`,
  });
  return true;
};
export const UpdateLocaleModal = ({
  establishmentId,
  inicialCoords,
  ratio,
}: IUpdateLocaleModalProps) => {
  const [coords, setCoords] = useState<ICoords>({
    lat: inicialCoords.lat,
    lng: inicialCoords.lng,
  });

  return (
    <>
      <ModalForm
        handlleSubmit={handleSubmit}
        submitButtonText="Salvar"
        openButton={({ onPress }) => (
          <Button
            endContent={<EditIcon className="h-5 w-5 stroke-primary-500" />}
            color="primary"
            onPress={onPress}
          >
            Editar
          </Button>
        )}
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
        <Input
          name="establishmentId"
          type="hidden"
          value={`${establishmentId}`}
          required
        />
        <Input name="lat" type="hidden" value={`${coords.lat}`} required />
        <Input name="lng" type="hidden" value={`${coords.lng}`} required />
        <Input
          name="ratio"
          type="number"
          label="Raio em KM para registro:"
          labelPlacement="outside"
          isRequired
          placeholder="Defina um raio em KM que o funcionário possa registrar seu ponto"
          defaultValue={ratio.toString()}
          required
        />
      </ModalForm>
    </>
  );
};
