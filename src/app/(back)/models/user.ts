import { prisma } from "@/prisma/prisma";

// errors
import { InputError } from "@/src/Errors/errors";

//utils
import { cpfUtils } from "@/src/utils/cpf";
import { emailUtils } from "@/src/utils/email";
import { passwordUtils } from "@/src/utils/password";

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

  if (login) {
    filters.push({ name });
  }

  if (filters.length === 0) return null;

  return prisma.user.findFirst({
    where: {
      OR: filters,
    },
  });
};
const validateUser = async (userId: string) => {
  const user = await findBy({ id: userId });

  if (!user)
    throw new InputError({
      message: "Gerente não encontrado",
      action: "Verifique se os dados do gerente foram informados corretamente",
      status_code: 400,
    });
};

const count = async () => {
  return await prisma.user.count();
};

const create = async ({
  name,
  email,
  cpf,
  password,
}: {
  name: string;
  email: string;
  cpf: string;
  password: string;
}) => {
  const user = await prisma.user.create({
    data: {
      name,
      email: emailUtils.normalize(email),
      cpf: cpfUtils.clean(cpf),
      hash: passwordUtils.genHash(password),
    },
  });

  return { id: user.id, email, password };
};
const userModel = {
  validateUser,
  findBy,
  count,
  create,
};

export { userModel };
