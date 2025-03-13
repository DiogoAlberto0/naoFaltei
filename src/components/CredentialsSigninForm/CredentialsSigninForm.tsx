"use client";
//next
import React, { useEffect } from "react";

//components
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { PasswordInput } from "../PasswordInput";
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
  useEffect(() => {
    if (invalidCredentialsError) {
      addToast({
        title: "Credenciais inválidas",
        description: "Verifique se o email e senha informados estão corretos",
        color: "danger",
        timeout: 10000,
      });
    }
  }, [invalidCredentialsError]);
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        isRequired
        errorMessage="Informe um email válido."
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Digite seu email"
        type="email"
      />
      <PasswordInput name="password" />

      <div className="w-full flex flex-wrap flex-row gap-5 bg-red-500">
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
