// heroui components
import { Input } from "@heroui/react";

//components
import { ModalForm } from "../Modal/ModalForm";
import { EditButton } from "../Buttons/EditButton";

//hook
import { useUpdateEstablishment } from "./useUpdateEstablishment";
interface IUpdateEstablishmentModal {
  id: string;
  name: string;
  phone: string;
  email: string;
  cep: string;
}

export const UpdateEstablishmentModal = ({
  id,
  name,
  phone,
  email,
}: IUpdateEstablishmentModal) => {
  const { handleSubmit, isLoading } = useUpdateEstablishment();
  return (
    <ModalForm
      handlleSubmit={handleSubmit}
      submitButtonText="Salvar"
      openButton={({ onPress }) => <EditButton onPress={onPress} />}
      isLoading={isLoading}
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
    </ModalForm>
  );
};
