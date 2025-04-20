"use client";

//hero ui
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { I18nProvider } from "@react-aria/i18n";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

// component
import { ModalForm } from "../../../components/Modal/ModalForm";

// errors
import { InputError } from "@/src/Errors/errors";

// fetcher
import { axios } from "@/src/utils/fetcher";

const registerMedicalLeaveHandler = async (formData: FormData) => {
  const workerId = formData.get("workerId")?.toString();

  const inicialDateString = formData.get("inicial")?.toString();
  const finalDateString = formData.get("final")?.toString();

  if (!workerId)
    throw new InputError({
      message: "Falha ao buscar funcionário",
      action: "Recarrege a página",
    });

  if (!inicialDateString || !finalDateString)
    throw new InputError({
      message: "A data inicial e final devem ser infomadas",
      action: "Verifique se as datas foram informadas",
    });

  const { data } = await axios<{ message: string }>({
    route: `/api/v1/clockin/setMedicalLeave`,
    method: "POST",
    body: {
      workerId: workerId,
      inicialDate: inicialDateString,
      finalDate: finalDateString,
    },
  });

  console.log({ data });

  addToast({
    color: "success",
    title: data.message,
  });
};
export const RegisterMedicalLeaveModal = ({
  workerId,
}: {
  workerId: string;
}) => {
  return (
    <ModalForm
      title="Registrar atestados"
      handleSubmit={registerMedicalLeaveHandler}
      openButton={({ onPress }) => (
        <Button color="secondary" onPress={onPress}>
          Registrar atestados
        </Button>
      )}
      submitButtonText="Registrar"
    >
      <Input type="hidden" value={workerId} name="workerId" />
      <I18nProvider locale="pt-BR">
        <div className="flex flex-col md:flex-row gap-4">
          <DatePicker
            showMonthAndYearPickers
            label="Data inicial:"
            labelPlacement="outside"
            description="Selecione o dia em que o atestado começa"
            name="inicial"
            className="w-full"
            isRequired
          />

          <DatePicker
            showMonthAndYearPickers
            label="Data final:"
            labelPlacement="outside"
            description="Selecione o dia em que o atestado termina"
            name="final"
            className="w-full"
            isRequired
          />
        </div>
      </I18nProvider>
    </ModalForm>
  );
};
