import { prisma } from "@/prisma/prisma";
import { establishmentModel } from "@/src/models/establishment";
import { passwordUtils } from "@/src/utils/password";

export interface IValidManager {
  id: string;
  email: string;
  password: string;
}
export const createValidManager = async () => {
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

export const createValidManager2 = async () => {
  const password = "123456789Abc.";
  const email = "validmanager2@email.com";
  const validManager = await prisma.user.create({
    data: {
      name: "Valid Manager 2",
      email,
      hash: passwordUtils.genHash(password),
      cpf: "98765432100",
    },
  });

  return {
    id: validManager.id,
    email,
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

export const createValidEstablishment = async (managerId: string) => {
  return await establishmentModel.create({
    cep: "01001000", // Sem pontos ou hífen
    email: "teste@example.com", // Normalizado em minúsculas
    lat: "-23.55052", // Latitude válida (São Paulo como exemplo)
    lng: "-46.633308", // Longitude válida (São Paulo como exemplo)
    managerId, // UUID válido
    name: "João da Silva", // Nome normalizado
    phone: "11987654321", // Sem espaços, parênteses ou traços
  });
};

export const createValidEstablishment2 = async (managerId: string) => {
  return await establishmentModel.create({
    cep: "20040002", // Sem pontos ou hífen
    email: "contato@empresa.com", // Normalizado em minúsculas
    lat: "-22.906847", // Latitude válida (Rio de Janeiro como exemplo)
    lng: "-43.172897", // Longitude válida (Rio de Janeiro como exemplo)
    managerId, // UUID válido
    name: "Maria Oliveira", // Nome normalizado
    phone: "21999998888", // Sem espaços, parênteses ou traços
  });
};
