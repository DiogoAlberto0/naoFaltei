import { PrismaClient, Establishment, User } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface IEstablishmentFromDB extends Establishment {}

interface IUserFromDB extends User {}

interface IUserWithoutHash extends Omit<User, "hash"> {}

export const resetAllDatabase = async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments", "accounts", "sessions", "verification_tokens", "workers" RESTART IDENTITY CASCADE`,
  );
};
export { type IEstablishmentFromDB, type IUserFromDB, type IUserWithoutHash };
