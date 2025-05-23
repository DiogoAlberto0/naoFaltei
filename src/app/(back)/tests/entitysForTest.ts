import { prisma } from "@/prisma/prisma";
//models
import { establishmentModel } from "@/src/app/(back)/models/establishment/establishment";
import { workerModel } from "../models/worker/worker";
import { userModel } from "../models/user/user";
import { clockinModel } from "../models/clockin/clockin";
import { scheduleModule } from "../models/schedule/schedule";

// data for tests
import { signinForTest } from "./signinForTest";
import { passwordUtils } from "@/src/utils/password";

export interface IValidAuthor {
  id: string;
  email: string;
  password: string;
}

//cria muitos workers

export const createManyAuthors = async () => {
  const baseDate = new Date();
  baseDate.setUTCMonth(baseDate.getUTCMonth() - 1);
  baseDate.setUTCDate(1);

  const usersToCreate = Array.from({ length: 20 }, (_, i) => {
    const createdAt = new Date(baseDate);
    createdAt.setUTCDate(createdAt.getUTCDate() + i); // incrementa 1 dia por usuário

    return {
      email: `user${i}@test.com`, // único
      created_at: createdAt,
    };
  });

  const createdUsers = await prisma.user.createMany({
    data: usersToCreate,
    skipDuplicates: true, // evita erro se rodar várias vezes
  });

  console.log(`${createdUsers.count} usuários criados para teste`);
};
export const createManyWorkers = async (establishmentId: string) => {
  const baseDate = new Date();
  baseDate.setUTCMonth(baseDate.getUTCMonth() - 1);
  baseDate.setUTCDate(1);

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
    "093.924.150-10",
    "427.630.510-14",
    "784.886.550-96",
    "141.836.860-16",
    "001.542.720-00",
    "209.245.050-60",
    "949.950.940-24",
    "814.672.760-30",
    "556.564.490-92",
    "989.996.190-60",
  ];
  const promises = cpfsValidos.map(async (cpf, index) => {
    const createdAt = new Date(baseDate);
    createdAt.setUTCDate(createdAt.getUTCDate() + index);
    return prisma.workers.create({
      data: {
        name: `Worker ${index}`,
        email: `worker${index}@email.com`,
        cpf,
        phone: `619999900${index.toString().padStart(2, "0")}`,
        establishment_id: establishmentId,
        created_at: createdAt,
        login: `Worker${index}@Establishment1`,
        hash: passwordUtils.genHash(`Worker${index}.`),
      },
    });
  });

  await Promise.all(promises);
};

export interface IScenario {
  author: {
    id: string;
    cookies: string;
  };
  establishment: {
    id: string;
  };
  manager: {
    id: string;
    cookie: string;
  };
  worker: {
    id: string;
    cookie: string;
  };
}

export const authenticateRoot = async () => {
  const { cookies } = await signinForTest({
    login: `${process.env.ROOT_INICIAL_LOGIN}`,
    password: `${process.env.ROOT_INICIAL_PASSWORD}`,
    isRoot: true,
  });

  return cookies;
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

  const created_at = new Date();

  created_at.setUTCMonth(created_at.getUTCMonth() - 2);

  await prisma.workers.update({
    where: {
      id: createdWorker.id,
    },
    data: {
      created_at,
    },
  });
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

export function getSundayLastMonth(fromDate = new Date()): Date {
  const date = new Date(fromDate);
  date.setUTCDate(date.getUTCDate() - 30); // Vai 30 dias atrás

  const day = date.getUTCDay(); // 0 = Domingo

  // Retrocede para o último domingo
  date.setUTCDate(date.getUTCDate() - day);

  return date;
}

export const createWorkerRegisterDay = async (
  workerId: string,
  weekDay: number,
  registersTime: string[],
) => {
  const register = async (date: Date) => {
    await clockinModel.register({
      workerId: workerId,
      clocked_at: date,
      lat: 0,
      lng: 0,
    });
  };
  const clock = getSundayLastMonth();
  clock.setUTCDate(clock.getUTCDate() + weekDay);

  for (const time of registersTime) {
    const [hour, minute] = time.split(":");
    const clockDate = new Date(clock);
    clockDate.setUTCHours(Number(hour), Number(minute), 0, 0);
    await register(clockDate); // <-- aguarda um antes de seguir pro próximo
  }

  return clock;
};

export const setValidSchedule = async (workerId: string) => {
  const weekSchedule = {
    startHour: 10,
    startMinute: 30,
    endHour: 20,
    endMinute: 0,
    restTimeInMinutes: 90,
  };
  await scheduleModule.setSchedule({
    workerId: workerId,
    schedule: {
      monday: weekSchedule,
      tuesday: weekSchedule,
      wednesday: weekSchedule,
      thursday: weekSchedule,
      friday: weekSchedule,
      saturday: {
        startHour: 8,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        restTimeInMinutes: 0,
      },
      sunday: null,
    },
  });
};

export const setValidSchedule2 = async (workerId: string) => {
  const weekSchedule = {
    startHour: 17,
    startMinute: 0,
    endHour: 2,
    endMinute: 0,
    restTimeInMinutes: 60,
  };
  await scheduleModule.setSchedule({
    workerId: workerId,
    schedule: {
      monday: weekSchedule,
      tuesday: weekSchedule,
      wednesday: weekSchedule,
      thursday: weekSchedule,
      friday: weekSchedule,
      saturday: {
        startHour: 8,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        restTimeInMinutes: 0,
      },
      sunday: null,
    },
  });
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
    lat: -23.55052,
    lng: -46.633308,
    creatorId,
    name: "João da Silva",
    phone: "11987654321",
    ratio: 20,
  });

  return establishment; // 🔥 Certifique-se de retornar o objeto completo
};

export const createValidEstablishment2 = async (creatorId: string) => {
  return await establishmentModel.create({
    cep: "20040002", // Sem pontos ou hífen
    email: "contato@empresa.com", // Normalizado em minúsculas
    lat: -22.906847, // Latitude válida (Rio de Janeiro como exemplo)
    lng: -43.172897, // Longitude válida (Rio de Janeiro como exemplo)
    creatorId, // UUID válido
    name: "Maria Oliveira", // Nome normalizado
    phone: "21999998888", // Sem espaços, parênteses ou traços
    ratio: 20,
  });
};
