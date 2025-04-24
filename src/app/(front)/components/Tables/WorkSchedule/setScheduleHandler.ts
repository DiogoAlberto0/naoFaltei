// fetcher
import { axios } from "@/src/utils/fetcher";

//errors
import { InputError } from "@/src/Errors/errors";

// heroui
import { addToast } from "@heroui/toast";
import { dateUtils } from "@/src/utils/date";

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

    // Horário local convertido para UTC, pois o backend espera UTC
    const [startLocaleHour, startLocaleMinute] = startTime
      .split(":")
      .map(Number);
    const { hour: startHour, minute: startMinute } =
      dateUtils.convertTimeFromLocaletoUTC({
        hour: startLocaleHour,
        minute: startLocaleMinute,
      });

    // Horário local convertido para UTC, pois o backend espera UTC
    const [endLocaleHour, endLocaleMinute] = endTime.split(":").map(Number);
    const { hour: endHour, minute: endMinute } =
      dateUtils.convertTimeFromLocaletoUTC({
        hour: endLocaleHour,
        minute: endLocaleMinute,
      });
    return {
      startHour: startHour,
      startMinute: startMinute,
      endHour: endHour,
      endMinute: endMinute,
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
