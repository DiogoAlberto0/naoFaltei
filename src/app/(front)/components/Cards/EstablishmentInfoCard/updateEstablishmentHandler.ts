import { revalidateTag } from "next/cache";

//errors
import { InputError } from "@/src/Errors/errors";

//utils
import { cepUtils } from "@/src/utils/cep";
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";

//fetcher
import { axios } from "@/src/utils/fetcher";

//heroui
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
export const updateEstablishmentHandler = async (formData: FormData) => {
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

  const { data } = await axios<IUpdateLocaleResponse>({
    route: `/api/v1/establishment/${id}/update`,
    method: "PUT",
    body: {
      name,
      phone,
      email,
      cep,
    },
  });

  addToast({
    color: "success",
    title: `Estabelecimento ${data.name} atualizado com sucesso!`,
  });
  revalidateTag(`establishmentId=${id}`);
};
