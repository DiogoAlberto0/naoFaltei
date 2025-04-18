"use client";
import { useState } from "react";

// heroui
import { Button, Input } from "@heroui/react";

// components
import { AddIconButton } from "../../../components/Buttons/AddIconButton";
import { ModalForm } from "../../../components/Modal/ModalForm";
import { ClockInputs } from "./RegisterClockModalInputs";

// handler
import { registerClockinHandler } from "./RegisterClockinHandler";

export const RegisterClockModal = ({ workerId }: { workerId: string }) => {
  const [inputGroups, setInputGroups] = useState([0]);

  return (
    <ModalForm
      title="Registrar entradas e saídas do funcionário"
      submitButtonText="Registrar"
      handleSubmit={registerClockinHandler}
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
