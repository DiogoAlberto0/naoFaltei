"use client";
import { useState } from "react";

// heroui
import { addToast, Button, Input } from "@heroui/react";

// components
import { AddIconButton } from "../../Buttons/AddIconButton";
import { ModalForm } from "../ModalForm";
import { ClockInputs } from "./RegisterClockModalInputs";

// handler
import { registerClockinHandler } from "./RegisterClockinHandler";

export const RegisterClockModal = ({
  workerId,
  isDemo = false,
}: {
  workerId: string;
  isDemo?: boolean;
}) => {
  const [inputGroups, setInputGroups] = useState([0]);

  return (
    <ModalForm
      title="Registrar entradas e saídas do funcionário"
      submitButtonText="Registrar"
      handleSubmit={async (formData) => {
        if (isDemo)
          return addToast({
            title: "Você está em uma versão demo",
            color: "warning",
          });
        await registerClockinHandler(formData);
      }}
      openButton={({ onPress }) => (
        <Button color="primary" onPress={onPress}>
          Registrar Entradas/Saídas
        </Button>
      )}
    >
      <Input type="hidden" name="workerId" value={workerId} />
      {inputGroups.map((id) => (
        <ClockInputs
          key={id}
          groupId={id}
          onRemove={() =>
            setInputGroups((prev) => prev.filter((v) => v !== id))
          }
        />
      ))}
      <div className="flex justify-center mt-4">
        <AddIconButton
          onPress={() =>
            setInputGroups((prev) => [
              ...prev,
              prev.length ? Math.max(...prev) + 1 : 0,
            ])
          }
        />
      </div>
    </ModalForm>
  );
};
