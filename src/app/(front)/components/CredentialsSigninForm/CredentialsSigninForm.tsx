"use client";
//next
import { useRouter } from "next/navigation";

//components
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { PasswordInput } from "../Inputs/PasswordInput";
//action
import { axios } from "@/src/utils/fetcher";
import { useSubmitForm } from "../../hooks/useSubmitForm";
import { InputError } from "@/src/Errors/errors";

const handleSubmit = async (formData: FormData) => {
  const login = formData.get("login")?.toString();
  const password = formData.get("password")?.toString();

  const root = formData.get("root")?.toString();

  if (!login || !password)
    throw new InputError({
      message: "Informe o login e a senha",
    });

  await axios({
    method: "POST",
    route: "/api/v1/signin",
    body: {
      login: formData.get("login")?.toString(),
      password: formData.get("password")?.toString(),
      root: root === "true",
    },
  });
};
export function CredentialsSigninForm({
  isRoot = false,
}: {
  isRoot?: boolean;
}) {
  const router = useRouter();
  const onSigninSuccess = () => {
    if (isRoot) router.push("/root/dashboard");
    else router.push("/worker");
  };
  const { isLoading, onSumit } = useSubmitForm(handleSubmit, onSigninSuccess);

  return (
    <Form onSubmit={onSumit} className="gap-3">
      <Input type="hidden" name="root" value={isRoot.toString()} />
      <Input
        isRequired
        errorMessage="Informe um login válido."
        label="Login"
        labelPlacement="outside"
        name="login"
        placeholder="Digite seu login"
        type="login"
      />
      <PasswordInput name="password" />

      <div className="w-full flex flex-wrap flex-row gap-5">
        <Button className="flex-1" variant="light" color="primary">
          Cancelar
        </Button>
        <Button
          className="flex-1"
          variant="shadow"
          color="primary"
          type="submit"
          isLoading={isLoading}
        >
          Entrar
        </Button>
      </div>
    </Form>
  );
}
