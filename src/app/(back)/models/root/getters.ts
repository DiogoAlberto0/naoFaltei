import { prisma } from "@/prisma/prisma";

const findUniqueByLogin = async ({ login }: { login: string }) => {
  const root = await prisma.rootUser.findUnique({
    where: {
      login,
    },
  });

  if (root)
    return {
      ...root,
      name: "root",
    };
};

const findUniqueById = async ({ id }: { id: string }) => {
  const root = await prisma.rootUser.findUnique({
    where: {
      id,
    },
  });

  return root;
};

export { findUniqueByLogin, findUniqueById };
