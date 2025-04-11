//hero ui
import { Input } from "@heroui/input";
//utils
import { cpfUtils } from "@/src/utils/cpf";
import { phoneUtils } from "@/src/utils/phone";

interface IWorkerInputsProps {
  establishmentId: string;
  workerId?: string;
  name?: string;
  phone?: string;
  email?: string;
  cpf?: string;
  login?: string;
  isUpdate?: boolean;
}
export const WorkerInputs = ({
  establishmentId,
  workerId,
  name,
  phone,
  email,
  cpf,
  login,
  isUpdate,
}: IWorkerInputsProps) => {
  return (
    <>
      <Input name="id" type="hidden" value={workerId} />
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
        defaultValue={name}
      />

      <Input
        label="Telefone:"
        labelPlacement="outside"
        placeholder="Digite o telefone do funcionário"
        type="phone"
        required
        isRequired
        name="phone"
        errorMessage="Favor digitar o telefone do funcionário"
        defaultValue={phone && phoneUtils.format(phone)}
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
        defaultValue={email}
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
        defaultValue={cpf && cpfUtils.format(cpf)}
      />

      <Input
        label="Login:"
        labelPlacement="outside"
        placeholder="Digite o login do funcionário"
        type="login"
        required
        isRequired
        name="login"
        errorMessage="Favor digitar o login do funcionário"
        defaultValue={login}
      />
      <Input
        label="Senha:"
        labelPlacement="outside"
        placeholder="Digite a senha do funcionário"
        type="text"
        required={!isUpdate}
        isRequired={!isUpdate}
        name="password"
        errorMessage="Favor digitar a senha do funcionário"
      />

      <Input
        label="Confirmar senha:"
        labelPlacement="outside"
        placeholder="Repita a senha"
        type="text"
        required={!isUpdate}
        isRequired={!isUpdate}
        name="confirmPassword"
        errorMessage="Favor confirmar a senha do funcionário"
      />
    </>
  );
};
