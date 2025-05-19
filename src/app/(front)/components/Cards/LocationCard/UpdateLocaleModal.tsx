import { useState } from "react";
//hero ui
import { addToast, Button, Input } from "@heroui/react";

//coponents
import { ModalForm } from "../../Modal/ModalForm";
import { Map } from "../../Map/Map";
import { EditIcon } from "@/assets/icons/EditIcon";

// fetcher
import { updateLocaleHandler } from "./updateLocaleHandler";
import { revalidateEstablishmentDetails } from "../../../hooks/getEstablishmentDetails";

interface ICoords {
  lat: number;
  lng: number;
}
interface IUpdateLocaleModalProps {
  isDemo?: boolean;
  establishmentId: string;
  inicialCoords: ICoords;
  ratio: number;
}

export const UpdateLocaleModal = ({
  establishmentId,
  inicialCoords,
  ratio: inicialRatio,
  isDemo = false,
}: IUpdateLocaleModalProps) => {
  const [coords, setCoords] = useState<ICoords>({
    lat: inicialCoords.lat,
    lng: inicialCoords.lng,
  });

  const [ratio, setRatio] = useState(inicialRatio);

  return (
    <>
      <ModalForm
        handleSubmit={async (formData) => {
          if (isDemo)
            return addToast({
              title: "Você está em uma versão demo",
              color: "warning",
            });
          await updateLocaleHandler(formData);
          revalidateEstablishmentDetails(establishmentId);
        }}
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
          markerRadius={ratio}
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
          label="Raio em metros para registro:"
          labelPlacement="outside"
          isRequired
          placeholder="Defina um raio em metros que o funcionário possa registrar seu ponto"
          value={String(ratio)}
          onValueChange={(value) => setRatio(Number(value))}
          required
        />
      </ModalForm>
    </>
  );
};
