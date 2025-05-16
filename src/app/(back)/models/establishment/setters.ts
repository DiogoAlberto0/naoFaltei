import { prisma } from "@/prisma/prisma";

// errors
import { InputError, ConflictError } from "@/src/Errors/errors";

// utils
import { cepUtils } from "@/src/utils/cep";
import { coordinateUtils } from "@/src/utils/coordinate";
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";

// models
import { userModel } from "../user/user";
import { countByEmail, countByPhone } from "./getters";

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

export { create, update };
