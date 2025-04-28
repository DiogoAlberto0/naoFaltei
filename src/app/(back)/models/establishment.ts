import { prisma } from "@/prisma/prisma";

// ERRORS
import { ConflictError, InputError, NotFoundError } from "@/src/Errors/errors";

//models
import { workerModel } from "@/src/app/(back)/models/worker";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "@/src/utils/cep";
import { coordinateUtils } from "@/src/utils/coordinate";
import { userModel } from "./user";

interface ICreateStablishment {
  name: string;
  email: string;
  phone: string;
  cep: string;
  lat: number | string;
  lng: number | string;
  creatorId: string;
  ratio: number;
}

interface IUpdateEstablishmentParams {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  cep?: string;
  lat?: number;
  lng?: number;
  ratio?: number;
}

interface IValidateStablishmentParams {
  id?: string;
  email?: string;
  phone?: string;
  cep?: string;
}

const validateParams = async ({
  id,
  phone,
  email,
  cep,
}: IValidateStablishmentParams) => {
  if (phone && !phoneUtils.isValid(phone))
    throw new InputError({
      message: "Telefone inválido",
      status_code: 400,
      action:
        "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
    });

  if (email && !emailUtils.isValid(email))
    throw new InputError({
      message: "Email inválido",
      status_code: 400,
      action:
        "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
    });

  if (cep && !cepUtils.isValid(cep))
    throw new InputError({
      message: "CEP inválido",
      status_code: 400,
      action: "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
    });

  if (email && (await countByEmail(email, id)) > 0)
    throw new ConflictError({
      message: "O email fornecido ja está em uso por outro estabelecimento.",
      action: "Informe outro email.",
    });

  if (phone && (await countByPhone(phone, id)) > 0)
    throw new ConflictError({
      message: "O telefone fornecido já está em uso por outro estabelecimento.",
      action: "Informe outro telefone.",
    });
};

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

const create = async (stablishment: ICreateStablishment) => {
  const { name, phone, email, cep, creatorId, ratio, ...coords } = stablishment;

  await validateParams({
    cep,
    email,
    phone,
  });
  const { lat, lng } = coordinateUtils.validateAndParse(coords);
  await userModel.validateUser(creatorId);

  const newEstablishment = await prisma.establishment.create({
    data: {
      cep: cepUtils.clean(cep),
      email: emailUtils.normalize(email),
      lat,
      lng,
      name,
      ratio,
      phone: phoneUtils.clean(phone),
      author: {
        connect: {
          id: creatorId,
        },
      },
    },
  });

  return newEstablishment;
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

const update = async ({
  id,
  name,
  email,
  phone,
  cep,
  lat,
  lng,
  ratio,
}: IUpdateEstablishmentParams) => {
  await validateParams({
    id,
    email,
    phone,
    cep,
  });
  return await prisma.establishment.update({
    where: {
      id,
    },
    data: {
      name,
      email: email && emailUtils.normalize(email),
      phone: phone && phoneUtils.clean(phone),
      cep: cep && cepUtils.clean(cep),
      lat,
      lng,
      ratio,
      updated_at: new Date(),
    },
  });
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

const establishmentModel = {
  create,
  countByEmail,
  countByPhone,
  count,
  update,
  listByAuthor,
  findBy,
  verifyIfManagerIsFromEstablishment,
  verifyIfIsAuthorFromEstablishment,
  validateEstablishment,
  getLocaleInfos,
};

export { establishmentModel };
