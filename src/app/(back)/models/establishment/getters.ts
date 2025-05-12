import { prisma } from "@/prisma/prisma";

// errors
import { NotFoundError } from "@/src/Errors/errors";

// utils
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";

// models
import { userModel } from "../user/user";
import { workerModel } from "../worker/worker";

const validateEstablishment = async (establishmentId: string) => {
  const existentEstablishment = await prisma.establishment.count({
    where: {
      id: establishmentId,
    },
  });
  if (existentEstablishment < 1)
    throw new NotFoundError({
      message: "Estabelecimento não encontrado",
      action: "Verifique se o ID do estabelecimento esta correto.",
    });
};

const countByPhone = async (phone: string, excludeId?: string) => {
  const cleanedPhone = phoneUtils.clean(phone);

  const where = excludeId
    ? {
        AND: [{ phone: cleanedPhone }, { id: { not: excludeId } }],
      }
    : { phone: cleanedPhone };

  return await prisma.establishment.count({
    where,
  });
};

const countByEmail = async (email: string, excludeId?: string) => {
  const normalizedEmail = emailUtils.normalize(email);

  const where = excludeId
    ? {
        AND: [{ email: normalizedEmail }, { id: { not: excludeId } }],
      }
    : { email: normalizedEmail };
  return await prisma.establishment.count({
    where,
  });
};

const count = async () => {
  return await prisma.establishment.count();
};

const listByAuthor = async ({ authorId }: { authorId: string }) => {
  return await prisma.establishment.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      author_id: authorId,
    },
  });
};

const findBy = async ({
  id,
  email,
  name,
}: {
  id?: string;
  name?: string;
  email?: string;
}) => {
  if (id)
    return await prisma.establishment.findUnique({
      where: { id },
    });

  const filters = [];

  if (name) filters.push({ name });
  if (email) filters.push({ email: emailUtils.normalize(email) });

  if (filters.length === 0) return null;

  return await prisma.establishment.findFirst({
    where: {
      OR: filters,
    },
  });
};

const verifyIfManagerIsFromEstablishment = async ({
  managerId,
  establishmentId,
}: {
  managerId: string;
  establishmentId: string;
}): Promise<boolean> => {
  const establishment = await findBy({ id: establishmentId });
  if (!establishment) return false;

  const author = await userModel.findBy({ id: managerId });
  if (establishment.author_id === author?.id) return true;

  const worker = await workerModel.findUniqueBy({ id: managerId });
  if (worker?.establishment_id == establishment.id && worker?.is_manager)
    return true;

  return false;
};

const verifyIfIsAuthorFromEstablishment = async ({
  authorId,
  establishmentId,
}: {
  authorId: string;
  establishmentId: string;
}): Promise<boolean> => {
  const establishment = await findBy({ id: establishmentId });
  if (!establishment) return false;

  if (establishment.author_id === authorId) return true;

  return false;
};

const getLocaleInfos = async ({
  establishmentId,
  workerId,
}: {
  establishmentId?: string;
  workerId?: string;
}) => {
  return await prisma.establishment.findFirst({
    where: {
      id: establishmentId,
      OR: [
        {
          workers: {
            some: {
              id: workerId,
            },
          },
        },
      ],
    },
    select: {
      lat: true,
      lng: true,
      ratio: true,
    },
  });
};

export {
  validateEstablishment,
  countByPhone,
  countByEmail,
  count,
  listByAuthor,
  verifyIfIsAuthorFromEstablishment,
  verifyIfManagerIsFromEstablishment,
  getLocaleInfos,
  findBy,
};
