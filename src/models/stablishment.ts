import {
  ConflictError,
  InputError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { prisma } from "@/prisma/prisma";

//models
import { userModel } from "@/src/models/user";

//utils
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "../utils/cep";
import { coordinateUtils } from "../utils/coordinate";

export interface IStablishment {
  name: string;
  email: string;
  phone: string;
  cep: string;
  lat: string;
  lng: string;
  managerId: string;
}

const create = async (stablishment: IStablishment) => {
  const { name, phone, email, cep, lat, lng, managerId } = stablishment;

  const manager = await userModel.findById(managerId);

  if (!manager) throw new UnauthorizedError();

  if (!phoneUtils.isValid(phone))
    throw new InputError({
      message: "Telefone inválido",
      status_code: 400,
      action:
        "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
    });

  if (!emailUtils.isValid(email))
    throw new InputError({
      message: "Email inválido",
      status_code: 400,
      action:
        "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
    });

  if (!cepUtils.isValid(cep))
    throw new InputError({
      message: "CEP inválido",
      status_code: 400,
      action: "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
    });

  if (!coordinateUtils.isValidLat(lat))
    throw new InputError({
      message: "Latitude inválida",
      status_code: 400,
      action: "Informe uma coordenada válida",
    });

  if (!coordinateUtils.isValidLng(lng))
    throw new InputError({
      message: "Longitude inválida",
      status_code: 400,
      action: "Informe uma coordenada válida",
    });

  if ((await countByEmail(email)) > 0)
    throw new ConflictError({
      message: "O email fornecido ja está em uso por outro estabelecimento.",
      status_code: 409,
      action: "Informe outro email.",
    });

  if ((await countByPhone(phone)) > 0)
    throw new ConflictError({
      message: "O telefone fornecido ja está em uso por outro estabelecimento.",
      status_code: 409,
      action: "Informe outro telefone.",
    });

  const newEstablishment = await prisma.establishment.create({
    data: {
      cep: cepUtils.clean(cep),
      email: emailUtils.normalize(email),
      lat,
      lng,
      name,
      phone: phoneUtils.clean(phone),
    },
  });

  await prisma.manager_on_establishments.create({
    data: {
      manager_id: managerId,
      establishment_id: newEstablishment.id,
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

const establishmentModel = {
  create,
  countByEmail,
  countByPhone,
  count,
};

export { establishmentModel };
