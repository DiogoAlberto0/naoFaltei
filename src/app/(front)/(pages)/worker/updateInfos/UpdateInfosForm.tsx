"use client";

// heroui components
import { addToast, Form } from "@heroui/react";
import { Input } from "@heroui/input";

// custom components
import { PasswordInput } from "@/src/app/(front)/components/Inputs/PasswordInput";
import { SaveButton } from "@/src/app/(front)/components/Buttons/SaveButton";

// errors
import { InputError } from "@/src/Errors/errors";
import { useSubmitForm } from "../../../hooks/useSubmitForm";

// utils
import { frontPasswordUtils } from "@/src/utils/password.front";

// fetcher
import { axios } from "@/src/utils/fetcher";
import { revalidateWorker } from "../../../components/Tables/WorkersTable/revalidateData";

const handleSubmit = async (formData: FormData) => {
  const workerId = formData.get("workerId")?.toString();
  if (!workerId)
    throw new InputError({
      message: "Falha ao buscar funcionário para atualização",
      action: "Recarregue a página",
    });

  const login = formData.get("login")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!login || !password || !confirmPassword)
    throw new InputError({
      message: "Campos obrigatórios faltando",
      action: "Favor informar login, senha e a confirmação da senha",
    });

  if (password !== confirmPassword)
    throw new InputError({
      message: "As senhas devem ser iguais",
      action: "Verifique se as senhas informadas estão corretas",
    });

  frontPasswordUtils.isValidOrThrow(password);

  const { response } = await axios<{ message: string }>({
    route: `/api/v1/signin/updateLoginAndPass`,
    method: "PUT",
    body: {
      login,
      password,
    },
  });

  revalidateWorker(workerId);

  if (response.status === 200) {
    addToast({
      title: "Login e senha atualizados com sucesso",
      color: "success",
    });
  }
};

export const UpdateInfosForm = ({ workerId }: { workerId: string }) => {
  const { onSumit, isLoading } = useSubmitForm(handleSubmit);

  return (
    <Form
      className="w-full flex flex-col gap-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm"
      onSubmit={onSumit}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Atualizar Login e Senha
      </h2>

      <Input type="hidden" name="workerId" value={workerId} />

      <Input
        name="login"
        type="text"
        required
        label="Novo login"
        labelPlacement="outside"
        placeholder="Digite o novo login"
        className="w-full"
      />

      <PasswordInput
        name="password"
        required
        label="Nova senha"
        labelPlacement="outside"
        placeholder="Digite a nova senha"
        className="w-full"
      />

      <PasswordInput
        name="confirmPassword"
        required
        label="Confirme a nova senha"
        labelPlacement="outside"
        placeholder="Confirme a nova senha"
        className="w-full"
      />

      <SaveButton className="w-full mt-4" type="submit" isLoading={isLoading} />
    </Form>
  );
};
