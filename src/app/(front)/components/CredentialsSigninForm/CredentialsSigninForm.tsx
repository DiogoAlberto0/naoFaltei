"use client";
//next
import React, { useEffect, useState } from "react";

//components
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { PasswordInput } from "../Inputs/PasswordInput";
import { addToast } from "@heroui/toast";

//action
import { credentialsSigninAction } from "./action";

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  await credentialsSigninAction(formData);
  addToast({
    title: "Toast title",
    description: "Toast displayed successfully",
    color: "danger",
  });
};
export function CredentialsSigninForm({
  invalidCredentialsError,
}: {
  invalidCredentialsError: boolean;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (invalidCredentialsError) {
      addToast({
        title: "Credenciais inválidas",
        description: "Verifique se o login e senha informados estão corretos",
        color: "danger",
        timeout: 10000,
      });
    }
  }, [invalidCredentialsError]);
  if (isClient)
    return (
      <Form onSubmit={handleSubmit} className="gap-3">
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
          >
            Entrar
          </Button>
        </div>
      </Form>
    );
}
