// fetcher
import { axios } from "@/src/utils/fetcher";

//errors
import { InputError } from "@/src/Errors/errors";

// heroui
import { addToast } from "@heroui/toast";

export const setScheduleHandler = async (formData: FormData) => {
  const workerId = formData.get("workerId");

  const genDayParams = (weekDay: string) => {
    const dayOff = formData.get(`${weekDay}_dayoff`)?.toString();
    console.log(dayOff);
    if (dayOff == "true") return null;

    const startTime = formData.get(`${weekDay}_start`)?.toString();
    const endTime = formData.get(`${weekDay}_end`)?.toString();
    const breakTime = formData.get(`${weekDay}_break`)?.toString();

    if (!startTime || !endTime || !breakTime)
      throw new InputError({
        message: "Campos obrigatórios faltando",
        action: "Verifique se todos os campos forma informados",
      });
    const [startHour, startMinute] = startTime.split(":");

    const [endHour, endMinute] = endTime.split(":");
    return {
      startHour: Number(startHour),
      startMinute: Number(startMinute),
      endHour: Number(endHour),
      endMinute: Number(endMinute),
      restTimeInMinutes: Number(breakTime),
    };
  };

  const schedule = {
    sunday: genDayParams("sunday"),
    monday: genDayParams("monday"),
    tuesday: genDayParams("tuesday"),
    wednesday: genDayParams("wednesday"),
    thursday: genDayParams("thursday"),
    friday: genDayParams("friday"),
    saturday: genDayParams("saturday"),
  };

  await axios({
    route: `/api/v1/worker/${workerId}/createWorkerSchedule`,
    method: "POST",
    body: { schedule },
  });

  addToast({
    color: "success",
    title: "Escala de trabalho atualizada com sucesso!",
  });
};
