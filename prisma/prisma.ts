import { PrismaClient, Establishment, User } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface IEstablishmentFromDB extends Establishment {}

interface IUserFromDB extends User {}

interface IUserWithoutHash extends Omit<User, "hash"> {}

export { type IEstablishmentFromDB, type IUserFromDB, type IUserWithoutHash };
