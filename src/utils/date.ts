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
  const date = new Date(year, month - 1, day);

  // Confere se o resultado bate com a entrada (ex: evita 2025-02-30 virar 2025-03-01)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
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

  return Math.floor(
    Math.abs((finalDate.getTime() - inicialDate.getTime()) / msPerMin),
  );
};

const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};
const dateUtils = {
  validateAndReturnDate,
  calculateFullDaysBetween,
  calculateMinutesBetween,
  getStartOfDay,
  getEndOfDay,
};

export { dateUtils };
