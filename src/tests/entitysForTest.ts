import { prisma } from "@/prisma/prisma";
import { establishmentModel } from "@/src/models/establishment";
import { passwordUtils } from "@/src/utils/password";

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
