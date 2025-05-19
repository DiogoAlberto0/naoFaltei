// heroui components
import { addToast, Input } from "@heroui/react";

//components
import { ModalForm } from "../../Modal/ModalForm";
import { EditButton } from "../../Buttons/EditButton";

//hook
import { updateEstablishmentHandler } from "./updateEstablishmentHandler";
interface IUpdateEstablishmentModal {
  id: string;
  name: string;
  phone: string;
  email: string;
  cep: string;
  isDemo?: boolean;
}

export const UpdateEstablishmentModal = ({
  id,
  name,
  phone,
  email,
  cep,
  isDemo,
}: IUpdateEstablishmentModal) => {
  return (
    <ModalForm
      handleSubmit={async (formData) => {
        if (isDemo)
          return addToast({
            title: "Você está em uma versão demo",
            color: "warning",
          });
        await updateEstablishmentHandler(formData);
      }}
      submitButtonText="Salvar"
      openButton={({ onPress }) => <EditButton onPress={onPress} />}
    >
      <Input name="id" type="hidden" value={id} />
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
        label="Cep:"
        labelPlacement="outside"
        defaultValue={cep}
      />
    </ModalForm>
  );
};
