import { InputError } from "../Errors/errors";

const validateAndReturnDate = (dateString: string) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(dateString)) {
    throw new InputError({
      message: "A data informada é inválida",
      action: "Verifique se a data está no formato YYYY-MM-DD",
    });
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Confere se o resultado bate com a entrada (ex: evita 2025-02-30 virar 2025-03-01)
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new InputError({
      message: "A data informada não é válida no calendário",
      action: "Verifique se o dia realmente existe nesse mês",
    });
  }

  return date;
};

const calculateFullDaysBetween = (inicialDate: Date, finalDate: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24;

  return Math.floor(
    Math.abs((finalDate.getTime() - inicialDate.getTime()) / msPerDay),
  );
};

const calculateMinutesBetween = (inicialDate: Date, finalDate: Date) => {
  const msPerMin = 1000 * 60;

  return Math.round(
    Math.abs((finalDate.getTime() - inicialDate.getTime()) / msPerMin),
  );
};

const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay;
};
const formatToYMD = (date: Date) => date.toISOString().split("T")[0];

const getAllDatesInRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(getStartOfDay(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
};

const formatTime = (hour: number, minute: number) => {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

const transformMinutesInTime = (
  minutes: number,
  { variant = "clock" }: { variant?: "clock" | "letter" } = {},
) => {
  const absBank = Math.abs(minutes);
  const hours = Math.floor(absBank / 60);
  const minute = absBank % 60;

  if (variant == "clock") return `${hours}:${minute}`;
  if (variant == "letter") return `${hours}h ${minute}m`;
};

const isISODate = (str: string) => {
  const date = new Date(str);
  const isIso = !isNaN(date.getTime()) && date.toISOString() === str;
  return isIso;
};

const convertTimeFromUTCtoLocale = ({
  hour,
  minute,
}: {
  hour: number;
  minute: number;
}) => {
  const date = new Date();
  date.setUTCHours(hour, minute);

  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

const convertTimeFromLocaletoUTC = ({
  hour,
  minute,
}: {
  hour: number;
  minute: number;
}) => {
  const date = new Date();
  date.setHours(hour, minute);

  return {
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
  };
};
const dateUtils = {
  validateAndReturnDate,
  calculateFullDaysBetween,
  calculateMinutesBetween,
  getStartOfDay,
  getEndOfDay,
  formatToYMD,
  getAllDatesInRange,
  formatTime,
  transformMinutesInTime,
  isISODate,
  convertTimeFromUTCtoLocale,
  convertTimeFromLocaletoUTC,
};

export { dateUtils };
