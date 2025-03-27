import { prisma } from "@/prisma/prisma";
import { establishmentModel } from "@/src/models/establishment";
import { passwordUtils } from "@/src/utils/password";

export interface IValidAuthor {
  id: string;
  email: string;
  password: string;
}

export const createValidEstablishmentCreator = async () => {
  const password = "123456789Abc.";
  const email = "validmanager@email.com";

  const validManager = await prisma.user.create({
    data: {
      name: "Valid Manager",
      email,
      hash: passwordUtils.genHash(password),
      cpf: "11144477735",
    },
  });

  return {
    id: validManager.id,
    email,
    password,
  };
};

export interface IValidManager {
  id: string;
  login: string;
  password: string;
}
export const createValidManager = async (establishmentId: string) => {
  const password = "123456789Abc.";
  const email = "validmanager@email.com";
  const login = "validManagerLogin";
  const phone = "61999999999";
  const validManager = await prisma.workers.create({
    data: {
      name: "Valid Manager",
      login,
      phone,
      email,
      hash: passwordUtils.genHash(password),
      cpf: "11144477735",
      is_admin: true,
      is_manager: true,
      establishment: {
        connect: {
          id: establishmentId,
        },
      },
    },
  });

  return {
    id: validManager.id,
    login,
    password,
  };
};

export const createValidManager2 = async (establishmentId: string) => {
  const password = "123456789Abc.";
  const email = "validmanager2@email.com";
  const login = "validManager2Login";
  const phone = "61999999998";
  const validManager = await prisma.workers.create({
    data: {
      name: "Valid Manager",
      login,
      phone,
      email,
      hash: passwordUtils.genHash(password),
      cpf: "11144477735",
      is_admin: true,
      is_manager: true,
      establishment: {
        connect: {
          id: establishmentId,
        },
      },
    },
  });

  return {
    id: validManager.id,
    login,
    password,
  };
};

export const createValidUser = async () => {
  const password = "123456789Abc.";
  const email = "validuser@email.com";
  const validManager = await prisma.user.create({
    data: {
      name: "Valid User",
      email,
      hash: passwordUtils.genHash(password),
      cpf: "09489226050",
    },
  });

  return {
    id: validManager.id,
    email,
    password,
  };
};

export const createValidUser2 = async () => {
  const password = "123456789Abc.";
  const email = "validuser2@email.com";
  const validManager = await prisma.user.create({
    data: {
      name: "Valid User 2",
      email,
      hash: passwordUtils.genHash(password),
      cpf: "06601607061",
    },
  });

  return {
    id: validManager.id,
    email,
    password,
  };
};

export const createValidEstablishment = async (creatorId: string) => {
  const establishment = await establishmentModel.create({
    cep: "01001000",
    email: "teste@example.com",
    lat: "-23.55052",
    lng: "-46.633308",
    creatorId,
    name: "João da Silva",
    phone: "11987654321",
  });

  return establishment; // 🔥 Certifique-se de retornar o objeto completo
};

export const createValidEstablishment2 = async (creatorId: string) => {
  return await establishmentModel.create({
    cep: "20040002", // Sem pontos ou hífen
    email: "contato@empresa.com", // Normalizado em minúsculas
    lat: "-22.906847", // Latitude válida (Rio de Janeiro como exemplo)
    lng: "-43.172897", // Longitude válida (Rio de Janeiro como exemplo)
    creatorId, // UUID válido
    name: "Maria Oliveira", // Nome normalizado
    phone: "21999998888", // Sem espaços, parênteses ou traços
  });
};
