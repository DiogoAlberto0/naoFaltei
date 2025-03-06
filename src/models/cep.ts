import { ConnectionError, InputError } from "../Errors/errors";
import { cepUtils } from "../utils/cep";

interface ICepResponse {
  cep: string;
  address_type: string;
  address_name: string;
  address: string;
  district: string;
  state: string;
  city: string;
  lat: string;
  lng: string;
  ddd: string;
  city_ibge: string;
}
const getAddres = async (cep: string): Promise<ICepResponse> => {
  if (!cepUtils.isValid(cep))
    throw new InputError({
      message: "CEP Inválido.",
      action: "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
      status_code: 400,
    });
  const cleanedCep = cepUtils.clean(cep);

  const response = await fetch(
    `https://cep.awesomeapi.com.br/json/${cleanedCep}`,

    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "GET",
    }
  );

  if (response.status == 404)
    throw new InputError({
      message: "CEP não encontrado no banco de dados",
      action:
        "Verifique se o CEP informado está correto, se estiver preencha as informações manualmente",
      status_code: 404,
    });

  if (!response.ok)
    throw new ConnectionError({
      message: "Falha ao se conectar com a API de CEP",
      status_code: response.status,
    });

  const data = await response.json();

  return data;
};

const cepModel = { getAddres };

export { cepModel };
