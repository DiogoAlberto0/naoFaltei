import { prisma } from "@/prisma/prisma";

// Errors
import { ConflictError, InputError } from "@/src/Errors/errors";
//utils
import { emailUtils } from "@/src/utils/email";
import { passwordUtils } from "@/src/utils/password";
import { cpfUtils } from "@/src/utils/cpf";
import { establishmentModel } from "./establishment";
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
const workerModel = {
  create,
  findBy,
  count,
  validateWorker,
  update,
  findUniqueBy,
  setManager,
};
export { workerModel };
