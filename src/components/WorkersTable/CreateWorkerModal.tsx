// heroui component
import { addToast, Input } from "@heroui/react";

// components
import { ModalForm } from "../Modal/ModalForm";

//errors
import { FetchError, InputError } from "@/src/Errors/errors";

// utils
import { emailUtils } from "@/src/utils/email";
import { cpfUtils } from "@/src/utils/cpf";
import { frontPasswordUtils } from "@/src/utils/password.front";

interface ICreateWorkerModalProps {
  establishmentId: string;
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
}
export const CreateWorkerModal = ({
  establishmentId,
  onOpenChange,
  isOpen,
}: ICreateWorkerModalProps) => {
  const handleSubmit = async (formData: FormData) => {
    const establishmentId = formData.get("establishmentId");
    const name = formData.get("name");
    const email = formData.get("email");
    const cpf = formData.get("cpf");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!name || !email || !cpf || !password || !confirmPassword)
      throw new InputError({
        message: "Campos obrigatórios faltando",
        action: "Informe o nome, email, cpf, senha e confirmação de senha.",
      });

    if (password !== confirmPassword)
      throw new InputError({
        message: "As senhas não coincidem",
        action: "Verifique a senha e a confirmação",
      });

    emailUtils.isValidOrThrow(email.toString());
    cpfUtils.isValidOrThrow(cpf.toString());
    frontPasswordUtils.isValidOrThrow(password.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/createUser`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          cpf,
          password,
          establishmentId,
        }),
      },
    );

    const data = await response.json();

    if (response.status != 201)
      throw new FetchError({
        message: data.message,
        action: data.action,
        status_code: response.status,
      });

    addToast({
      color: "success",
      title: `Funcionário ${data.name} criado com sucesso`,
    });
  };
  return (
    <ModalForm
      handleSubmit={handleSubmit}
      submitButtonText="Criar"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
    >
      <Input name="establishmentId" type="hidden" value={establishmentId} />
      <Input
        label="Nome:"
        labelPlacement="outside"
        placeholder="Digite o nome do funcionário"
        type="text"
        required
        isRequired
        name="name"
        errorMessage="Favor digitar o nome do funcionário"
      />

      <Input
        label="Email:"
        labelPlacement="outside"
        placeholder="Digite o email do funcionário"
        type="email"
        required
        isRequired
        name="email"
        errorMessage="Favor digitar o email do funcionário"
      />

      <Input
        label="CPF:"
        labelPlacement="outside"
        placeholder="Digite o CPF do funcionário"
        type="CPF"
        required
        isRequired
        name="cpf"
        errorMessage="Favor digitar o cpf do funcionário"
      />

      <Input
        label="Senha:"
        labelPlacement="outside"
        placeholder="Digite a senha do funcionário"
        type="text"
        required
        isRequired
        name="password"
        errorMessage="Favor digitar a senha do funcionário"
      />

      <Input
        label="Confirmar senha:"
        labelPlacement="outside"
        placeholder="Repita a senha"
        type="password"
        required
        isRequired
        name="confirmPassword"
        errorMessage="Favor confirmar a senha do funcionário"
      />
    </ModalForm>
  );
};
