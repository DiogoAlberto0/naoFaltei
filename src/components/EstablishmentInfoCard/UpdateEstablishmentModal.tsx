// heroui components
import { Input } from "@heroui/react";
import { addToast } from "@heroui/toast";

//components
import { ModalForm } from "../Modal/ModalForm";

// utils
import { cepUtils } from "@/src/utils/cep";
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";

// errors
import { InputError, FetchError } from "@/src/Errors/errors";
interface IUpdateEstablishmentModal {
  id: string;
  name: string;
  phone: string;
  email: string;
  cep: string;
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
}
export const UpdateEstablishmentModal = ({
  id,
  name,
  phone,
  email,
  cep,
  isOpen,
  onOpenChange,
}: IUpdateEstablishmentModal) => {
  const handleSubmit = async (formData: FormData) => {
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/establishment/${id}/update`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
          phone,
          email,
          cep,
        }),
      },
    );

    const data = await response.json();

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
  };
  return (
    <ModalForm
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      handleSubmit={handleSubmit}
      submitButtonText="Salvar"
    >
      <Input
        name="name"
        type="text"
        required
        label="Nome:"
        labelPlacement="outside"
        defaultValue={name}
      />
      <Input
        name="phone"
        type="phone"
        required
        label="Telefone:"
        labelPlacement="outside"
        defaultValue={phone}
      />
      <Input
        name="email"
        type="email"
        required
        label="Email:"
        labelPlacement="outside"
        defaultValue={email}
      />
      <Input
        name="cep"
        type="cep"
        required
        label="CEP:"
        labelPlacement="outside"
        defaultValue={cep}
      />
    </ModalForm>
  );
};
