import { prisma } from "@/prisma/prisma";

//utils
import { passwordUtils } from "@/src/utils/password";
import { emailUtils } from "../utils/email";
import { InputError, ConflictError } from "../Errors/errors";

const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  return user;
};

const create = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
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

  const existentUser = await findByEmail(email);
  if (existentUser)
    throw new ConflictError({
      message: "O Email fornecido já está em uso por outro usuário.",
      action: "Informe outro email",
      status_code: 409,
    });

  const hashedPass = passwordUtils.genHash(password);

  const createdUser = await prisma.user.create({
    data: {
      email: emailUtils.normalize(email),
      name,
      hash: hashedPass,
    },
  });
  return {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    emailVerified: createdUser.emailVerified,
    image: createdUser.image,
  };
};

const findById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const count = async () => {
  return await prisma.user.count();
};

const userModel = { create, findByEmail, findById, count };
export { userModel };
