import { prisma } from "@/prisma/prisma";

// utils
import { cpfUtils } from "@/src/utils/cpf";
import { emailUtils } from "@/src/utils/email";
import { passwordUtils } from "@/src/utils/password";

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

export { create };
