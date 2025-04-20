//errors
import { InputError } from "@/src/Errors/errors";

//utils
import { cepUtils } from "@/src/utils/cep";
import { coordinateUtils } from "@/src/utils/coordinate";
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";

//fetcher
import { axios } from "@/src/utils/fetcher";

//heroui
import { addToast } from "@heroui/toast";

const useCreateEstablishment = () => {
  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const cep = formData.get("cep");
    const ratio = formData.get("ratio");
    const lat = formData.get("lat");
    const lng = formData.get("lng");

    if (!name || !phone || !email || !cep || !ratio || isNaN(Number(ratio)))
      throw new InputError({
        message: "Campos obrigatorios faltando",
        action:
          "Informe o nome, telefone, email e cep, e raio para registro de ponto do novo estabelecimento",
      });

    phoneUtils.isValidOrThrow(phone.toString());
    emailUtils.isValidOrThrow(email.toString());
    cepUtils.isValidOrThrow(cep.toString());
    coordinateUtils.isValidOrThrow({ lat: Number(lat), lng: Number(lng) });

    const { data } = await axios<{ name: string }>({
      route: "/api/v1/establishment/create",
      method: "POST",
      body: {
        name,
        phone,
        email,
        cep,
        ratio: Number(ratio),
        lat: Number(lat),
        lng: Number(lng),
      },
    });

    addToast({
      title: `Empresa ${data.name} criada com sucesso`,
      color: "success",
    });
  };

  return { handleSubmit };
};

export { useCreateEstablishment };
