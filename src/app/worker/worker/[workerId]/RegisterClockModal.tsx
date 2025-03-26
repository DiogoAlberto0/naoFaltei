"use client";
import { useState } from "react";

//heroui
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { DatePicker } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { now, getLocalTimeZone } from "@internationalized/date";

// custom components
import { AddIconButton } from "@/src/components/Buttons/AddIconButton";
import { ModalForm } from "@/src/components/Modal/ModalForm";
import { DeleteIconButton } from "@/src/components/Buttons/DeleteIconButton";
import { DoubleSwitch } from "@/src/components/Inputs/DoubleSwitch";

const ClockInputs = ({ onRemoveInput }: { onRemoveInput: () => void }) => {
  return (
    <div className="flex bg-content2 rounded-lg p-2 even:bg-content4 justify-center items-center gap-5">
      <div className="flex-1 flex max-sm:flex-col justify-center items-center gap-5">
        <I18nProvider locale="pt-br">
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            name="dateTime"
            defaultValue={now(getLocalTimeZone())}
            label="Selecione a data e o horário:"
            labelPlacement="outside"
            isRequired
            variant="faded"
          />
        </I18nProvider>

        <DoubleSwitch leftLabel="Entrada" rightLabel="Saída" />
      </div>

      <DeleteIconButton onPress={onRemoveInput} />
    </div>
  );
};
export const RegisterClockModal = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const [counter, setCounter] = useState(1);
  const [inputsIds, setInputsIds] = useState<number[]>([0]);

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Registrar Entradas/Saídas
      </Button>
      <ModalForm
        title="Registrar entradas e saídas do funcionário"
        submitButtonText="Registrar"
        handleSubmit={async (formData) => {
          console.log(formData.get("DateTime"));
        }}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        className=""
      >
        {inputsIds.map((id) => (
          <ClockInputs
            key={id}
            onRemoveInput={() => {
              setInputsIds((prev) => prev.filter((inputId) => inputId !== id));
            }}
          />
        ))}

        <div className=" w-full flex justify-center items-center mt-4">
          <AddIconButton
            color="success"
            variant="flat"
            onPress={() => {
              setCounter((prevCounter) => prevCounter + 1);
              setInputsIds((prev) => [...prev, counter]);
            }}
          />
        </div>
      </ModalForm>
    </>
  );
};
