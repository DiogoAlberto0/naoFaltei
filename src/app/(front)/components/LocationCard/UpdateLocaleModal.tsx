import { useState } from "react";
//hero ui
import { Button, Input } from "@heroui/react";

//coponents
import { ModalForm } from "../Modal/ModalForm";
import { Map } from "../Map/Map";
import { EditIcon } from "@/assets/icons/EditIcon";
import { updateLocaleHandler } from "./updateLocaleHandler";

interface ICoords {
  lat: number;
  lng: number;
}
interface IUpdateLocaleModalProps {
  establishmentId: string;
  inicialCoords: ICoords;
  ratio: number;
}

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
        handleSubmit={updateLocaleHandler}
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
