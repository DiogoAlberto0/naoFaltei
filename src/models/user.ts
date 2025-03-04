import { prisma } from "@/prisma/prisma";

//utils
import { genHash } from "@/src/utils/password";

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
  const hash = genHash(password);
  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      hash,
    },
  });
};

const userModel = { createUser, findByEmail };
export { userModel };
