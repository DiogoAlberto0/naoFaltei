import { prisma } from "@/prisma/prisma";

// Errors
import { ConflictError, InputError } from "../Errors/errors";
//utils
import { emailUtils } from "../utils/email";
import { passwordUtils } from "@/src/utils/password";
import { cpfUtils } from "../utils/cpf";
import { establishmentModel } from "./establishment";
import { phoneUtils } from "../utils/phone";

const findBy = async ({
  id,
  cpf,
  email,
  name,
  login,
}: {
  id?: string;
  email?: string;
  name?: string;
  cpf?: string;
  login?: string;
}) => {
  if (id) {
    return prisma.workers.findUnique({
      where: { id },
    });
  }

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

  if (login) {
    filters.push({ login });
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

  const establishment = await establishmentModel.findBy({
    id: establishmentId,
  });

  if (!establishment)
    throw new InputError({
      message: "Estabelecimento não encontrado",
      action: "Informe o id de um estabelecimento válido",
      status_code: 400,
    });

  const existentWorker = await findBy({
    cpf,
    email,
  });

  if (!existentWorker) {
    const hashedPass = passwordUtils.genHash(password);

    const createdWorker = await prisma.workers.create({
      data: {
        name,
        login,
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
    };
  } else {
    const establishmentFromWorker = await establishmentModel.listByWorker({
      workerId: existentWorker.id,
    });

    const isAlreadyAssociated = establishmentFromWorker.some(
      ({ id }) => establishment.id === id,
    );

    if (isAlreadyAssociated)
      throw new ConflictError({
        message: "O usuário informado ja está associado ao estabelecimento",
        action: "Verifique o usuário e o estabelecimento",
      });

    return {
      id: existentWorker.id,
      login: existentWorker.login,
      name: existentWorker.name,
      email: existentWorker.email,
      cpf: existentWorker.cpf,
    };
  }
};

const count = async () => {
  return await prisma.workers.count();
};

const validateWorker = async (workerId: string) => {
  const worker = await findBy({ id: workerId });

  if (!worker)
    throw new InputError({
      message: "Funcionário não encontrado",
      action:
        "Verifique se os dados do funcionário foram informados corretamente",
      status_code: 400,
    });
};
const workerModel = { create, findBy, count, validateWorker };
export { workerModel };
