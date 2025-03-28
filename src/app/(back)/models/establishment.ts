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
  lat: string;
  lng: string;
  creatorId: string;
}

interface IUpdateEstablishmentParams {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  cep?: string;
  lat?: string;
  lng?: string;
}

interface IValidateStablishmentParams {
  email?: string;
  phone?: string;
  cep?: string;
  lat?: string;
  lng?: string;
}

const validateParams = async ({
  phone,
  email,
  cep,
  lat,
  lng,
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

  if (lat && !coordinateUtils.isValidLat(lat))
    throw new InputError({
      message: "Latitude inválida",
      status_code: 400,
      action: "Informe uma coordenada válida",
    });

  if (lng && !coordinateUtils.isValidLng(lng))
    throw new InputError({
      message: "Longitude inválida",
      status_code: 400,
      action: "Informe uma coordenada válida",
    });

  if (email && (await countByEmail(email)) > 0)
    throw new ConflictError({
      message: "O email fornecido ja está em uso por outro estabelecimento.",
      action: "Informe outro email.",
    });

  if (phone && (await countByPhone(phone)) > 0)
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
  const { name, phone, email, cep, lat, lng, creatorId } = stablishment;

  await validateParams(stablishment);
  await userModel.validateUser(creatorId);

  const newEstablishment = await prisma.establishment.create({
    data: {
      cep: cepUtils.clean(cep),
      email: emailUtils.normalize(email),
      lat,
      lng,
      name,
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

const countByPhone = async (phone: string) => {
  const cleanedPhone = phoneUtils.clean(phone);
  return await prisma.establishment.count({
    where: { phone: cleanedPhone },
  });
};

const countByEmail = async (email: string) => {
  const normalizedEmail = emailUtils.normalize(email);
  return await prisma.establishment.count({
    where: { email: normalizedEmail },
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
}: IUpdateEstablishmentParams) => {
  await validateParams({
    email,
    phone,
    cep,
    lat,
    lng,
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

  const worker = await workerModel.findBy({ id: managerId });
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
};

export { establishmentModel };
