//prisma
import { prisma } from "@/prisma/prisma";
import { $Enums } from "@prisma/client";

//models
import { establishmentModel } from "./establishment";
// Errors
import { ConflictError, InputError } from "@/src/Errors/errors";
//utils
import { emailUtils } from "@/src/utils/email";
import { passwordUtils } from "@/src/utils/password";
import { cpfUtils } from "@/src/utils/cpf";
import { phoneUtils } from "@/src/utils/phone";
import { loginUtils } from "@/src/utils/login";

const findUniqueBy = ({ id, login }: { id?: string; login?: string }) => {
  if (id) {
    return prisma.workers.findUnique({
      where: { id },
    });
  }

  if (login) {
    return prisma.workers.findUnique({
      where: { login: loginUtils.normalize(login) },
    });
  }
};
const findBy = async ({
  cpf,
  email,
  name,
}: {
  email?: string;
  name?: string;
  cpf?: string;
}) => {
  const filters = [];

  if (email) {
    filters.push({ email: emailUtils.normalize(email) });
  }

  if (cpf) {
    filters.push({ cpf: cpfUtils.clean(cpf) });
  }

  if (name) {
    filters.push({ name });
  }

  if (filters.length === 0) return null;

  return prisma.workers.findFirst({
    where: {
      OR: filters,
    },
  });
};

const create = async ({
  email,
  password,
  name,
  cpf,
  establishmentId,
  login,
  phone,
}: {
  email: string;
  password: string;
  name: string;
  cpf: string;
  establishmentId: string;
  phone: string;
  login: string;
}) => {
  emailUtils.isValidOrThrow(email);
  phoneUtils.isValidOrThrow(phone);
  passwordUtils.isValidOrThrow(password);
  cpfUtils.isValidOrThrow(cpf);
  loginUtils.isValidOrThrow(login);

  const establishment = await establishmentModel.findBy({
    id: establishmentId,
  });

  if (!establishment)
    throw new InputError({
      message: "Estabelecimento não encontrado",
      action: "Informe o id de um estabelecimento válido",
      status_code: 400,
    });

  const existentWorker = await findUniqueBy({
    login,
  });

  if (existentWorker)
    throw new ConflictError({
      message: "O login informado ja está em uso por outro funcionário.",
      action: "Informe outro login",
    });

  const hashedPass = passwordUtils.genHash(password);
  const createdWorker = await prisma.workers.create({
    data: {
      name,
      login: loginUtils.normalize(login),
      phone: phoneUtils.clean(phone),
      establishment: {
        connect: {
          id: establishment.id,
        },
      },
      email: emailUtils.normalize(email),
      cpf: cpfUtils.clean(cpf),
      hash: hashedPass,
    },
  });

  return {
    id: createdWorker.id,
    name: createdWorker.name,
    email: createdWorker.email,
    login: createdWorker.login,
    cpf: createdWorker.cpf,
    phone: createdWorker.phone,
  };
};

const count = async () => {
  return await prisma.workers.count();
};

const validateWorker = async (workerId: string) => {
  const worker = await findUniqueBy({ id: workerId });

  if (!worker)
    throw new InputError({
      message: "Funcionário não encontrado",
      action:
        "Verifique se os dados do funcionário foram informados corretamente",
      status_code: 400,
    });
};

const update = async ({
  id,
  cpf,
  email,
  isManager,
  login,
  name,
  phone,
  password,
}: {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  login: string;
  email: string;
  isManager: boolean;
  password?: string;
}) => {
  cpfUtils.isValidOrThrow(cpf);
  phoneUtils.isValidOrThrow(phone);
  loginUtils.isValidOrThrow(login);
  emailUtils.isValidOrThrow(email);
  if (password) passwordUtils.isValidOrThrow(password);

  const isAlreadyLoginInUse = await findUniqueBy({ login });
  if (isAlreadyLoginInUse && isAlreadyLoginInUse.id != id)
    throw new ConflictError({
      message: "O Login informado já está em uso por outro funcionário",
      action: "Informe outro login",
    });

  const worker = await prisma.workers.update({
    where: {
      id,
    },
    data: {
      name,
      cpf: cpfUtils.clean(cpf),
      email: emailUtils.normalize(email),
      phone: phoneUtils.clean(phone),
      login: loginUtils.normalize(login),
      is_manager: isManager,
      hash: password ? passwordUtils.genHash(password) : undefined,
    },
  });

  return {
    name: worker.name,
    id: worker.id,
    email: worker.email,
    cpf: worker.cpf,
    phone: worker.phone,
    login: worker.login,
    is_manager: worker.is_manager,
    establishment_id: worker.establishment_id,
  };
};

const setManager = async (workerId: string) => {
  await prisma.workers.update({
    where: { id: workerId },
    data: {
      is_manager: true,
    },
  });
};

type WeekDays =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

interface IScheduleProps {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  restTimeInMinutes: number;
}

const WeekDayEnumMap: Record<WeekDays, $Enums.WeekDay> = {
  sunday: $Enums.WeekDay.SUNDAY,
  monday: $Enums.WeekDay.MONDAY,
  tuesday: $Enums.WeekDay.TUESDAY,
  wednesday: $Enums.WeekDay.WEDNESDAY,
  thursday: $Enums.WeekDay.THURSDAY,
  friday: $Enums.WeekDay.FRIDAY,
  saturday: $Enums.WeekDay.SATURDAY,
};
interface ICreateSchedule {
  workerId: string;
  schedule: Record<WeekDays, IScheduleProps | null>;
}
const setSchedule = async ({ workerId, schedule }: ICreateSchedule) => {
  for (const [day, shift] of Object.entries(schedule) as [
    WeekDays,
    IScheduleProps | null,
  ][]) {
    const weekDayEnum = WeekDayEnumMap[day]; // Converte para o Enum correto

    if (!weekDayEnum) continue; // Evita erro caso o dia seja inválido
    await prisma.workerSchedule.create({
      data: {
        worker_id: workerId,
        week_day: weekDayEnum,
        start_hour: shift?.startHour ?? 0,
        start_minute: shift?.startMinute ?? 0,
        end_hour: shift?.endHour ?? 0,
        end_minute: shift?.endMinute ?? 0,
        rest_time_in_minutes: shift?.restTimeInMinutes ?? 0,
        is_day_off: shift === null,
      },
    });
  }
};

const deleteSchedule = async (workerId: string) => {
  await prisma.workerSchedule.deleteMany({
    where: {
      worker_id: workerId,
    },
  });
};

const getSchedule = async (workerId: string) => {
  const schedules = await prisma.workerSchedule.findMany({
    where: { worker_id: workerId },
  });

  const schedulesObj = Object.fromEntries(
    schedules.map(
      ({
        week_day,
        start_hour,
        start_minute,
        end_hour,
        end_minute,
        rest_time_in_minutes,
        is_day_off,
      }) => [
        week_day.toLowerCase(),
        {
          startHour: start_hour,
          startMinute: start_minute,
          endHour: end_hour,
          endMinute: end_minute,
          restTimeInMinutes: rest_time_in_minutes,
          isDayOff: is_day_off,
        },
      ],
    ),
  );

  return schedulesObj;
};
const workerModel = {
  create,
  findBy,
  count,
  validateWorker,
  update,
  findUniqueBy,
  setManager,
  setSchedule,
  deleteSchedule,
  getSchedule,
};
export { workerModel };
