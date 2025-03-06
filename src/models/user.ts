import { prisma } from "@/prisma/prisma";

//utils
import { passwordUtils } from "@/src/utils/password";

const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  return user;
};

const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const hash = passwordUtils.genHash(password);
  return await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      hash,
    },
  });
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

const userModel = { createUser, findByEmail, findById, count };
export { userModel };
