import { prisma } from "@/prisma/prisma";

// ERRORS
import { ConflictError, InputError, NotFoundError } from "@/src/Errors/errors";

//models
import { userModel } from "@/src/models/user";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "../utils/cep";
import { coordinateUtils } from "../utils/coordinate";

interface ICreateStablishment {
  name: string;
  email: string;
  phone: string;
  cep: string;
  lat: string;
  lng: string;
  managerId: string;
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
  const { name, phone, email, cep, lat, lng, managerId } = stablishment;

  await validateParams(stablishment);
  await userModel.validateUser(managerId);

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
          id: managerId,
        },
      },
    },
  });

  await addManager({
    managerId,
    establishmentId: newEstablishment.id,
    isValidManager: true,
    isValidEstablishment: true,
  });

  return newEstablishment;
};

interface IAddManagerProps {
  managerId: string;
  establishmentId: string;
  isValidManager?: boolean;
  isValidEstablishment?: boolean;
}
const addManager = async ({
  managerId,
  establishmentId,
  isValidEstablishment = false,
  isValidManager = false,
}: IAddManagerProps) => {
  if (!isValidManager) {
    userModel.validateUser(managerId);
  }

  if (!isValidEstablishment) {
    validateEstablishment(establishmentId);
  }

  const managedEstablishments = await listByManager({ managerId });

  const isAlreadyManager = managedEstablishments.some(
    ({ id }) => establishmentId === id,
  );

  if (isAlreadyManager)
    throw new ConflictError({
      message: "O usuário já é gerênte do estabelecimento.",
      action: "Verifique o email do usuário",
    });

  await prisma.manager_on_establishments.create({
    data: {
      manager_id: managerId,
      establishment_id: establishmentId,
    },
  });
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

const listByManager = async ({ managerId }: { managerId: string }) => {
  return await prisma.establishment.findMany({
    where: {
      managers: {
        some: {
          manager_id: managerId,
        },
      },
    },
  });
};

const listByWorker = async ({ workerId }: { workerId: string }) => {
  return await prisma.establishment.findMany({
    where: {
      workers: {
        some: {
          worker_id: workerId,
        },
      },
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
}) => {
  const establishmentsFromAuthenticatedManager =
    await establishmentModel.listByManager({ managerId });

  return establishmentsFromAuthenticatedManager.some(
    ({ id }) => id === establishmentId,
  );
};

const verifyIfIsAuthorFromEstablishment = async ({
  userId,
  establishmentId,
}: {
  userId: string;
  establishmentId: string;
}) => {
  const establishment = await prisma.establishment.findUnique({
    where: { id: establishmentId },
    select: {
      author_id: true,
    },
  });

  if (!establishment)
    throw new NotFoundError({
      message: "Estabelecimento não encontrado",
      action:
        "Verifique se os dados informados do estabelecimento estão corretos",
    });

  return establishment.author_id == userId;
};

const establishmentModel = {
  create,
  countByEmail,
  countByPhone,
  count,
  update,
  listByManager,
  findBy,
  listByWorker,
  addManager,
  verifyIfManagerIsFromEstablishment,
  verifyIfIsAuthorFromEstablishment,
};

export { establishmentModel };
