"use client";
import { useEffect, useState } from "react";

//heroui components
import { Form } from "@heroui/react";
import { Input } from "@heroui/input";

//custom components
import { PasswordInput } from "@/src/components/PasswordInput";
import { SaveButton } from "@/src/components/Buttons/SaveButton";

export const UpdateInfosForm = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient)
    return (
      <Form
        className="flex flex-col relative z-0 flex-1 justify-center"
        onSubmit={(e) => console.log(e)}
      >
        <Input
          name="email"
          type="email"
          required
          label="Novo email:"
          labelPlacement="outside"
          placeholder="Digite o novo email aqui"
        />
        <PasswordInput
          name="password"
          required
          label="Nova senha:"
          labelPlacement="outside"
          placeholder="Digite a nova senha aqui"
        />

        <PasswordInput
          name="confirmPassword"
          required
          label="Confirme a senha:"
          labelPlacement="outside"
          placeholder="Digite a nova senha aqui"
        />

        <SaveButton className="w-full mt-5" />
      </Form>
    );
};
