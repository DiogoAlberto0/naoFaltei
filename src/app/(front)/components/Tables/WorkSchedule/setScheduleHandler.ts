// fetcher
import { axios } from "@/src/utils/fetcher";

//errors
import { InputError } from "@/src/Errors/errors";

// heroui
import { addToast } from "@heroui/toast";

type IValidDaysOff =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
const validDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const isValidScheduleType = (
  type: string | undefined,
): type is "day" | "week" | "nothing" => {
  return type === "nothing" || type === "day" || type === "week";
};
const getScheduleType = (formData: FormData) => {
  const type = formData.get("type")?.toString();
  const isValid = isValidScheduleType(type);
  if (!isValid)
    throw new InputError({
      message: "Tipo de escala inválido",
      action: "Selecione um tipo de escala válido",
    });
  return type;
};

const isValidDaysOff = (daysOff: unknown): daysOff is IValidDaysOff[] => {
  return Array.isArray(daysOff) && daysOff.every((d) => validDays.includes(d));
};
const getDaysOff = (formData: FormData) => {
  const daysOffInput = formData.get("daysOff")?.toString() || "[]";
  const daysOff = JSON.parse(daysOffInput);

  console.log(daysOffInput);
  const isValid = isValidDaysOff(daysOff);
  if (!isValid)
    throw new InputError({
      message: "Dias de folga inválidos",
      action: "Verifique se os dias da semana foram informados corretamente",
    });

  return daysOff;
};

const getMinutesFromTime = (time: string, isDayOff: boolean) => {
  if (!time || isDayOff) return 0;
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const getDayMinutes = (formData: FormData, daysOff: IValidDaysOff[]) => {
  const sundayMinutesInput = formData.get("sunday_minutes")?.toString();
  const mondayMinutesInput = formData.get("monday_minutes")?.toString();
  const tuesdayMinutesInput = formData.get("tuesday_minutes")?.toString();
  const wednesdayMinutesInput = formData.get("wednesday_minutes")?.toString();
  const thursdayMinutesInput = formData.get("thursday_minutes")?.toString();
  const fridayMinutesInput = formData.get("friday_minutes")?.toString();
  const saturdayMinutesInput = formData.get("saturday_minutes")?.toString();
  if (
    !sundayMinutesInput ||
    !mondayMinutesInput ||
    !tuesdayMinutesInput ||
    !wednesdayMinutesInput ||
    !thursdayMinutesInput ||
    !fridayMinutesInput ||
    !saturdayMinutesInput
  )
    throw new InputError({
      message: "Horas por dia inválida",
      action: "Verifique se todos os dias foram informados",
    });

  //SUNDAY
  const sunday_minutes = getMinutesFromTime(
    sundayMinutesInput,
    daysOff.includes("sunday"),
  );
  //MONDAY
  const monday_minutes = getMinutesFromTime(
    mondayMinutesInput,
    daysOff.includes("monday"),
  );
  //TUESDAY
  const tuesday_minutes = getMinutesFromTime(
    tuesdayMinutesInput,
    daysOff.includes("tuesday"),
  );
  //WEDNESDAY
  const wednesday_minutes = getMinutesFromTime(
    wednesdayMinutesInput,
    daysOff.includes("wednesday"),
  );
  //THURSDAY
  const thursday_minutes = getMinutesFromTime(
    thursdayMinutesInput,
    daysOff.includes("thursday"),
  );
  //FRIDAY
  const friday_minutes = getMinutesFromTime(
    fridayMinutesInput,
    daysOff.includes("friday"),
  );
  //SATURDAY
  const saturday_minutes = getMinutesFromTime(
    saturdayMinutesInput,
    daysOff.includes("saturday"),
  );

  return {
    sunday_minutes,
    monday_minutes,
    tuesday_minutes,
    wednesday_minutes,
    thursday_minutes,
    friday_minutes,
    saturday_minutes,
  };
};

const sendDaySchedule = async (
  workerId: string,
  {
    sunday_minutes,
    monday_minutes,
    tuesday_minutes,
    wednesday_minutes,
    thursday_minutes,
    friday_minutes,
    saturday_minutes,
  }: {
    sunday_minutes: number;
    monday_minutes: number;
    tuesday_minutes: number;
    wednesday_minutes: number;
    thursday_minutes: number;
    friday_minutes: number;
    saturday_minutes: number;
  },
  daysOff: IValidDaysOff[],
) => {
  await axios({
    route: `/api/v2/worker/${workerId}/createWorkerSchedule`,
    method: "POST",
    body: {
      type: "day",
      daysOff,
      sunday_minutes,
      monday_minutes,
      tuesday_minutes,
      wednesday_minutes,
      thursday_minutes,
      friday_minutes,
      saturday_minutes,
    },
  });
};

const isValidWeekMinutes = (weekMinutes: unknown): weekMinutes is number => {
  return !isNaN(Number(weekMinutes));
};
const getWeekMinutes = (formData: FormData) => {
  const weekMinutes = formData.get("week_minutes")?.toString();
  const isValid = isValidWeekMinutes(weekMinutes);

  if (!isValid)
    throw new InputError({
      message: "Horas por semana inválida",
      action:
        "Verifique se os valores de horas por semana foram informados, e são valores numéricos",
    });
  return Number(weekMinutes);
};

const sendWeekSchedule = async (
  workerId: string,
  weekMinutes: number,
  daysOff: IValidDaysOff[],
) => {
  await axios({
    route: `/api/v2/worker/${workerId}/createWorkerSchedule`,
    method: "POST",
    body: {
      type: "week",
      daysOff,
      week_minutes: Number(weekMinutes),
    },
  });
};

const sendNothingSchedule = async (workerId: string) => {
  await axios({
    route: `/api/v2/worker/${workerId}/createWorkerSchedule`,
    method: "POST",
    body: {
      type: "nothing",
    },
  });
};

export const setScheduleHandler = async (formData: FormData) => {
  const workerId = formData.get("workerId")?.toString();
  if (!workerId)
    throw new InputError({
      message: "Falha ao indentificar o funcionário",
      action: "Recarregue a página, se o erro persistir contate o suporte",
    });

  //get and validate type
  const type = getScheduleType(formData);

  //get and validate daysOff
  const daysOff = getDaysOff(formData);

  if (type === "day") {
    const dayMinutes = getDayMinutes(formData, daysOff);
    await sendDaySchedule(workerId, dayMinutes, daysOff);
  } else if (type === "week") {
    const weekMinutes = getWeekMinutes(formData);
    await sendWeekSchedule(workerId, weekMinutes, daysOff);
  } else await sendNothingSchedule(workerId);
  addToast({
    color: "success",
    title: "Escala de trabalho atualizada com sucesso!",
  });
};
