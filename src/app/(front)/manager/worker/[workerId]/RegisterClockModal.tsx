"use client";
import { useState } from "react";

//heroui
import { Button } from "@heroui/button";
import { addToast, DatePicker, Input } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

// custom components
import { AddIconButton } from "@/src/app/(front)/components/Buttons/AddIconButton";
import { ModalForm } from "@/src/app/(front)/components/Modal/ModalForm";
import { DeleteIconButton } from "@/src/app/(front)/components/Buttons/DeleteIconButton";
import { RemoveIconButton } from "../../../components/Buttons/RemoveIconButton";

//errors
import { InputError } from "@/src/Errors/errors";

//fetcher
import { axios } from "@/src/utils/fetcher";

const registerClockinHandler = async (formData: FormData) => {
  const workerId = formData.get("workerId");
  if (!workerId)
    throw new InputError({
      message: "Falha ao identificar o usuário",
      action: "Recarregue a página",
    });
  const days: { [key: string]: string } = {};
  const timesPerDay: { [key: string]: string[] } = {};
  const registers: { clockedAt: string }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.includes("day")) {
      const [, id] = key.split("-");
      days[id] = value.toString();
    } else if (key.includes("time")) {
      const [, id] = key.split("-");
      timesPerDay[id] = [...(timesPerDay[id] || []), value.toString()];
    }
  }

  for (const day in timesPerDay) {
    for (const time of timesPerDay[day]) {
      const localDate = new Date(`${days[day]}T${time}`);
      registers.push({ clockedAt: localDate.toISOString() });
    }
  }

  const { data } = await axios<{ message: string }>({
    route: "/api/v1/clockin/managerRegister",
    method: "POST",
    body: {
      workerId,
      registers,
    },
  });

  addToast({
    color: "success",
    title: "Folha de ponto atualizada com sucesso",
    description: data.message,
  });
};
const ClockInputs = ({
  onRemoveInput,
  clockId,
}: {
  onRemoveInput: () => void;
  clockId: number;
}) => {
  const [counter, setCounter] = useState(1);
  const [inputIds, setInputIds] = useState([0]);

  return (
    <div className="flex bg-content2 rounded-lg p-2 even:bg-content4 justify-center items-center gap-5">
      <div className="flex-1 flex flex-col max-sm:flex-col justify-center items-center gap-5">
        <I18nProvider locale="pt-br">
          <DatePicker
            isRequired
            label="Selecione a data:"
            name={`day-${clockId}`}
          />
        </I18nProvider>
        <div className=" flex-1 w-full flex flex-wrap gap-2 items-center">
          {inputIds.map((id, index) => (
            <Input
              key={id}
              id={id.toString()}
              label={index % 2 == 0 ? "Entrada" : "Saída"}
              variant={index % 2 == 0 ? "bordered" : "underlined"}
              type="time"
              className="w-max"
              name={`time-${clockId}`}
            />
          ))}
          <RemoveIconButton
            onPress={() => setInputIds((prev) => prev.slice(0, -1))}
          />
          <AddIconButton
            onPress={() => {
              setCounter((prevState) => prevState + 1);
              setInputIds((prevState) => [...prevState, counter]);
            }}
          />
        </div>
      </div>

      <DeleteIconButton onPress={onRemoveInput} />
    </div>
  );
};
export const RegisterClockModal = ({ workerId }: { workerId: string }) => {
  const [counter, setCounter] = useState(1);
  const [inputsIds, setInputsIds] = useState<number[]>([0]);

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
      <Input name="workerId" type="hidden" value={workerId} />
      {inputsIds.map((id) => (
        <ClockInputs
          key={id}
          clockId={id}
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
  );
};
