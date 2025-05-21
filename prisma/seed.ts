import { passwordUtils } from "@/src/utils/password";
import { prisma } from "./prisma";

const main = async () => {
  const existentRoot = await prisma.rootUser.findUnique({
    where: {
      login: `${process.env.ROOT_INICIAL_LOGIN?.toLowerCase()}`,
    },
  });

  if (existentRoot) return;

  await prisma.rootUser.create({
    data: {
      login: `${process.env.ROOT_INICIAL_LOGIN}`,
      hash: passwordUtils.genHash(`${process.env.ROOT_INICIAL_PASSWORD}`),
    },
  });
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
