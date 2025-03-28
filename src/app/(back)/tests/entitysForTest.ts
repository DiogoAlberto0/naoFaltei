import { prisma } from "@/prisma/prisma";

//utils
import { passwordUtils } from "@/src/utils/password";

//models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "../models/worker";

export interface IValidAuthor {
  id: string;
  email: string;
  password: string;
}

export const createValidAutho = async () => {
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

export const createValidAutho2 = async () => {
  const password = "123456789Abc.";
  const email = "validAuthor2@email.com";

  const validManager = await prisma.user.create({
    data: {
      name: "Valid Author 2",
      email,
      hash: passwordUtils.genHash(password),
      cpf: "46363146038",
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
  const name = "validManager";
  const password = "123456789Abc.";
  const email = "validmanager@email.com";
  const login = "validManager@ValidEstablishment";
  const phone = "61999999999";
  const cpf = "11144477735";
  const createdManager = await workerModel.create({
    name,
    login,
    phone,
    email,
    password,
    cpf,
    establishmentId,
  });

  await prisma.workers.update({
    where: { id: createdManager.id },
    data: {
      is_manager: true,
    },
  });

  return {
    id: createdManager.id,
    login: createdManager.login,
    password,
  };
};

export const createValidManager2 = async (establishmentId: string) => {
  const name = "validManager2";
  const password = "123456789Abc.";
  const email = "validmanager2@email.com";
  const login = "validManager2@validEstablishment2";
  const phone = "61999999998";
  const cpf = "11144477735";
  const createdManager = await workerModel.create({
    name,
    login,
    phone,
    email,
    password,
    cpf,
    establishmentId,
  });

  await prisma.workers.update({
    where: { id: createdManager.id },
    data: {
      is_manager: true,
    },
  });

  return {
    id: createdManager.id,
    login: createdManager.login,
    password,
  };
};

export const createValidWorker = async (establishmentId: string) => {
  const name = "validWorker";
  const password = "123456789Abc.";
  const email = "validworker@email.com";
  const login = "validWorker@validEstablishment2";
  const phone = "61999999991";
  const cpf = "11512075000";
  const createdWorker = await workerModel.create({
    name,
    login,
    phone,
    email,
    password,
    cpf,
    establishmentId,
  });

  return {
    id: createdWorker.id,
    login: createdWorker.login,
    password,
  };
};

export const createValidWorker2 = async (establishmentId: string) => {
  const name = "validWorker2";
  const password = "123456789Abc.";
  const email = "validworker2@email.com";
  const login = "validWorker2@validEstablishment2";
  const phone = "61999999998";
  const cpf = "97476783069";
  const createdWorker = await workerModel.create({
    name,
    login,
    phone,
    email,
    password,
    cpf,
    establishmentId,
  });

  return {
    id: createdWorker.id,
    login: createdWorker.login,
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
