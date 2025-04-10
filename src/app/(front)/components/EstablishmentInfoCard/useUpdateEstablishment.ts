import { InputError, FetchError } from "@/src/Errors/errors";
import { cepUtils } from "@/src/utils/cep";
import { emailUtils } from "@/src/utils/email";
import { axios } from "@/src/utils/fetcher";
import { phoneUtils } from "@/src/utils/phone";
import { addToast } from "@heroui/toast";
import { revalidateTag } from "next/cache";
import { useState } from "react";

const useUpdateEstablishment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const id = formData.get("id");
      const name = formData.get("name");
      const phone = formData.get("phone");
      const email = formData.get("email");
      const cep = formData.get("cep");

      if (!name || !phone || !email || !cep)
        throw new InputError({
          message: "Campos obrigatórios faltando",
          action: "Informe o nome, telefone, email e cep do estabelecimento",
        });

      phoneUtils.isValidOrThrow(phone.toString());
      emailUtils.isValidOrThrow(email.toString());
      cepUtils.isValidOrThrow(cep.toString());

      const { response, data } = await axios({
        route: `/api/v1/establishment/${id}/update`,
        method: "PUT",
        body: {
          name,
          phone,
          email,
          cep,
        },
      });

      if (response.status != 200)
        throw new FetchError({
          message: data.message,
          status_code: response.status,
          action: data.actio,
        });

      addToast({
        color: "success",
        title: `Estabelecimento ${data.name} atualizado com sucesso!`,
      });
      revalidateTag(`establishmentId=${id}`);
      return true;
    } catch (error: any) {
      if (error.status_code != 500) {
        addToast({
          color: "danger",
          title: error.message,
          description: error.action,
        });
        return false;
      } else throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};

export { useUpdateEstablishment };
