import { prisma } from "@/prisma/prisma";

// Errors
import { InputError } from "../Errors/errors";
//utils
import { emailUtils } from "../utils/email";
import { passwordUtils } from "@/src/utils/password";
import { cpfUtils } from "../utils/cpf";
import { establishmentModel } from "./establishment";

const findBy = async ({
  id,
  cpf,
  email,
  name,
}: {
  id?: string;
  email?: string;
  name?: string;
  cpf?: string;
}) => {
  if (id) {
    return prisma.user.findUnique({
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

  if (filters.length === 0) return null;

  return prisma.user.findFirst({
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
}: {
  email: string;
  password: string;
  name: string;
  cpf: string;
  establishmentId: string;
}) => {
  if (!emailUtils.isValid(email))
    throw new InputError({
      message: "Email inválido.",
      action:
        "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
      status_code: 400,
    });

  if (!passwordUtils.isValid(password))
    throw new InputError({
      message: "Senha inválida.",
      action:
        "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
      status_code: 400,
    });

  if (!cpfUtils.isValid(cpf))
    throw new InputError({
      message: "CPF inválido",
      action: "Informe um cpf válido",
      status_code: 400,
    });

  const establishment = await establishmentModel.findBy({
    id: establishmentId,
  });

  if (!establishment)
    throw new InputError({
      message: "Estabelecimento não encontrado",
      action: "Informe o id de um estabelecimento válido",
      status_code: 400,
    });

  const existentUser = await findBy({
    cpf,
    email,
  });

  if (!existentUser) {
    const hashedPass = passwordUtils.genHash(password);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email: emailUtils.normalize(email),
        cpf: cpfUtils.clean(cpf),
        hash: hashedPass,
      },
    });

    await prisma.worker_on_establishments.create({
      data: {
        worker_id: createdUser.id,
        establishment_id: establishment.id,
      },
    });
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      emailVerified: createdUser.emailVerified,
      image: createdUser.image,
    };
  } else {
    await prisma.worker_on_establishments.create({
      data: {
        establishment_id: establishment.id,
        worker_id: existentUser.id,
      },
    });

    return {
      id: existentUser.id,
      name: existentUser.name,
      email: existentUser.email,
      emailVerified: existentUser.emailVerified,
      image: existentUser.image,
    };
  }
};

const count = async () => {
  return await prisma.user.count();
};

const userModel = { create, findBy, count };
export { userModel };
