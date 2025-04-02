//models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "../models/worker";
import { signinForTest } from "./signinForTest";
import { userModel } from "../models/user";

export interface IValidAuthor {
  id: string;
  email: string;
  password: string;
}

//cria muitos workers

export const createManyWorkers = async (establishmentId: string) => {
  const cpfsValidos = [
    "819.268.970-05",
    "648.041.340-77",
    "174.333.640-30",
    "492.196.190-59",
    "688.862.070-00",
    "916.278.980-50",
    "890.313.020-07",
    "032.116.740-63",
    "545.437.330-37",
    "469.770.410-05",
  ];
  cpfsValidos.forEach(
    async (cpf, index) =>
      await workerModel.create({
        name: `Worker ${index}`,
        email: `worker${index}@email.com`,
        cpf,
        phone: `619999900${index.toString().padStart(2, "0")}`,
        establishmentId,
        login: `Worker${index}@Establishment1`,
        password: `Worker${index}.`,
      }),
  );
};
// cria cenários
export const createScenario1 = async () => {
  const author = await createAndAuthAuthor();
  const establishment = await createValidEstablishment(author.id);
  const manager = await createAndAuthValidManager(establishment.id);
  const worker = await createAndAuthWorker(establishment.id);

  return {
    author: {
      id: author.id,
      cookies: author.cookies,
    },
    establishment: {
      id: establishment.id,
    },
    manager: {
      id: manager.id,
      cookie: manager.cookies,
    },
    worker: {
      id: worker.id,
      cookie: worker.cookies,
    },
  };
};

export const createScenario2 = async () => {
  const author = await createAndAuthAuthor2();
  const establishment = await createValidEstablishment2(author.id);
  const manager = await createAndAuthValidManager2(establishment.id);
  const worker = await createAndAuthWorker2(establishment.id);

  return {
    author: {
      id: author.id,
      cookies: author.cookies,
    },
    establishment: {
      id: establishment.id,
    },
    manager: {
      id: manager.id,
      cookie: manager.cookies,
    },
    worker: {
      id: worker.id,
      cookie: worker.cookies,
    },
  };
};

// helper function

const createWorker = async (
  name: string,
  email: string,
  login: string,
  phone: string,
  cpf: string,
  isManager: boolean,
  establishmentId: string,
) => {
  const password = "123456789Abc.";
  const createdWorker = await workerModel.create({
    name,
    login,
    phone,
    email,
    password,
    cpf,
    establishmentId,
  });

  if (isManager) await workerModel.setManager(createdWorker.id);

  return {
    id: createdWorker.id,
    login: createdWorker.login,
    password,
  };
};

const createAndAuth = async (
  createfunction: () => Promise<{
    id: string;
    login?: string;
    email?: string;
    password: string;
  }>,
) => {
  const validUser = await createfunction();

  const { cookies } = await signinForTest({
    login:
      validUser.login || validUser.email || "invalidUser@invalidEstablishment",
    password: validUser.password,
  });

  return {
    id: validUser.id,
    cookies,
  };
};

const createAuthor = async (name: string, email: string, cpf: string) => {
  const password = "123456789Abc.";

  const user = await userModel.create({
    name,
    email,
    cpf,
    password,
  });

  return { id: user.id, email, password };
};
// authors
export const createValidAuthor = async () => {
  return await createAuthor(
    "Valid Author",
    "validAuthor@email.com",
    "11144477735",
  );
};

export const createValidAuthor2 = async () => {
  return await createAuthor(
    "Valid Author 2",
    "validAuthor2@email.com",
    "46363146038",
  );
};

export const createAndAuthAuthor = async () => {
  return createAndAuth(() => createValidAuthor());
};

export const createAndAuthAuthor2 = async () => {
  return createAndAuth(() => createValidAuthor2());
};

// manager

export interface IValidManager {
  id: string;
  login: string;
  password: string;
}

export const createValidManager = async (establishmentId: string) => {
  return await createWorker(
    "Valid Manager",
    "validManager@email.com",
    "validManager@validEstablishment",
    "61999999999",
    "04090242010",
    true,
    establishmentId,
  );
};

export const createValidManager2 = async (establishmentId: string) => {
  return await createWorker(
    "Valid Manager 2",
    "validManager2@email.com",
    "validManager2@validEstablishment2",
    "61999999998",
    "66042295055",
    true,
    establishmentId,
  );
};

export const createAndAuthValidManager = async (establishmentId: string) => {
  return await createAndAuth(() => createValidManager(establishmentId));
};

export const createAndAuthValidManager2 = async (establishmentId: string) => {
  return await createAndAuth(() => createValidManager2(establishmentId));
};

// worker

export const createValidWorker = async (establishmentId: string) => {
  return await createWorker(
    "Valid Worker",
    "validWorker@email.com",
    "validWorker@validEstablishment",
    "61999999997",
    "45479864017",
    false,
    establishmentId,
  );
};

export const createValidWorker2 = async (establishmentId: string) => {
  return await createWorker(
    "Valid Worker 2",
    "validWorker2@email.com",
    "validWorker2@validEstablishment2",
    "61999999996",
    "93707149013",
    false,
    establishmentId,
  );
};
export const createAndAuthWorker = async (establishmentId: string) => {
  return await createAndAuth(() => createValidWorker(establishmentId));
};

export const createAndAuthWorker2 = async (establishmentId: string) => {
  return await createAndAuth(() => createValidWorker2(establishmentId));
};

// establishment
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
