import { useState } from "react";
//errors
import { InputError, FetchError } from "@/src/Errors/errors";

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
  const [isPending, setIsPending] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    try {
      setIsPending(true);
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

      const { response, data } = await axios({
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

      if (response.status !== 201)
        throw new FetchError({
          message: data.message,
          status_code: response.status,
          action: data.action,
        });
      addToast({
        title: `Empresa ${data.name} criada com sucesso`,
        color: "success",
      });
      return true;
    } catch (error: any) {
      if (error.status_code !== 500) {
        addToast({
          title: error.message,
          description: error.action,
          color: "danger",
        });
        return false;
      } else throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { handleSubmit, isPending };
};

export { useCreateEstablishment };
