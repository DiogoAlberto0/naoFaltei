//errors
import { InputError } from "@/src/Errors/errors";

//utils
import { coordinateUtils } from "@/src/utils/coordinate";

//fetcher
import { axios } from "@/src/utils/fetcher";

//hero ui
import { addToast } from "@heroui/toast";

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

export const updateLocaleHandler = async (formData: FormData) => {
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const ratio = Number(formData.get("ratio"));

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

  addToast({
    color: "success",
    title: `Localização da empresa ${data.name} alterada com sucesso`,
  });
};
