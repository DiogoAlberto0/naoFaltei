import { omit } from "lodash";
import { describe, expect, it, beforeAll } from "vitest";

// scenarios
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";
import { resetAllDatabase } from "@/prisma/prisma";

//model
import { scheduleModule } from "@/src/app/(back)/models/schedule/schedule";

//scenario 1 variables
let author1Cookie: string;
let worker1Id: string;
let worker1Cookie: string;

//scenario 2 variables
let worker2Id: string;
let manager2Cookie: string;
let author2Cookie: string;

beforeAll(async () => {
  await resetAllDatabase();
  const scenario1 = await createScenario1();
  author1Cookie = scenario1.author.cookies;
  worker1Id = scenario1.worker.id;
  worker1Cookie = scenario1.worker.cookie;

  const scenario2 = await createScenario2();
  author2Cookie = scenario2.author.cookies;
  manager2Cookie = scenario2.manager.cookie;
  worker2Id = scenario2.worker.id;
});

type WeekDays =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

const validEntryAndExit = {
  startHour: 10,
  startMinute: 30,
  endHour: 20,
  endMinute: 0,
  restTimeInMinutes: 90,
};

const validSchedule = {
  sunday: null,
  monday: validEntryAndExit,
  tuesday: validEntryAndExit,
  wednesday: validEntryAndExit,
  thursday: validEntryAndExit,
  friday: validEntryAndExit,
  saturday: {
    startHour: 8,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    restTimeInMinutes: 0,
  },
} as const;

const createScheduleFetch = async (
  cookie: string,
  workerId: string,
  body: any,
) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/worker/${workerId}/createWorkerSchedule`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookie
        ? {
            cookie,
          }
        : {},
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  cookie,
  body,
  workerId,
  expectedStatusCode,
  expectedResponseData,
}: {
  cookie: string;
  workerId: string;
  body: any;
  expectedStatusCode?: number;
  expectedResponseData: any;
}) => {
  const { response, data } = await createScheduleFetch(cookie, workerId, body);

  expect(response.status).toStrictEqual(expectedStatusCode);
  const workerScheduleFromDB = await scheduleModule.getSchedule(workerId);

  if (response.status === 201) {
    expect(workerScheduleFromDB).toEqual(data);

    Object.entries(workerScheduleFromDB).forEach(([key, value]) => {
      if (validSchedule[key as WeekDays] == null) {
        expect(value).toEqual({
          startHour: 0,
          startMinute: 0,
          endHour: 0,
          endMinute: 0,
          restTimeInMinutes: 0,
          isDayOff: true,
        });
      } else {
        expect(value).toEqual({
          ...validSchedule[key as WeekDays],
          isDayOff: false,
        });
      }
    });
  } else {
    expect(data).toStrictEqual(expectedResponseData);
    expect(workerScheduleFromDB).toStrictEqual({});
  }
};

describe("PUT on /api/v1/worker/:id/createWorkerSchedule", () => {
  describe("Anonymous user", () => {
    it("should be return unauthorized message", async () => {
      await expectations({
        cookie: "",
        workerId: worker1Id,
        body: {},
        expectedStatusCode: 401,
        expectedResponseData: {
          message: "Usuário não autorizado",
          action: "Faça login no site",
        },
      });
    });
  });

  describe("Auhtrnticated worker", () => {
    it("should be return unauthorized message", async () => {
      await expectations({
        cookie: worker1Cookie,
        workerId: worker1Id,
        body: {},
        expectedStatusCode: 403,
        expectedResponseData: {
          action: "Contate o suporte.",
          message: "Usuário não tem permissão para fazer essa operação.",
        },
      });
    });
  });

  describe("Auhtrnticated manager from another establishment", () => {
    it("should be return unauthorized message", async () => {
      await expectations({
        cookie: manager2Cookie,
        workerId: worker1Id,
        body: {},
        expectedStatusCode: 403,
        expectedResponseData: {
          action: "Contate o suporte.",
          message: "Usuário não tem permissão para fazer essa operação.",
        },
      });
    });
  });

  describe("Auhtrnticated author from another establishment", () => {
    it("should be return unauthorized message", async () => {
      await expectations({
        cookie: author2Cookie,
        workerId: worker1Id,
        body: {},
        expectedStatusCode: 403,
        expectedResponseData: {
          action: "Contate o suporte.",
          message: "Usuário não tem permissão para fazer essa operação.",
        },
      });
    });
  });
  describe("Authenticated author from estabilhemnt", () => {
    describe("worker id", async () => {
      it("should return error if invalid worker id is provided", async () => {
        await expectations({
          cookie: author1Cookie,
          workerId: "invalidWorkerId",
          body: { schedule: validSchedule },
          expectedStatusCode: 404,
          expectedResponseData: {
            action: "Verifique o ID informado",
            message: "Funcionário não encontrado",
          },
        });
      });
    });

    describe.each([
      ["startHour", "startHour"],
      ["startMinute", "startMinute"],
      ["endHour", "endHour"],
      ["endMinute", "endMinute"],
      ["restTimeInMinutes", "restTimeInMinutes"],
    ])("Validação de campos obrigatórios", (label, field) => {
      it(`Deve retornar erro se ${label} não for fornecido`, async () => {
        await expectations({
          cookie: author1Cookie,
          workerId: worker1Id,
          body: {
            schedule: {
              ...validSchedule,
              monday: omit(validEntryAndExit, field),
            },
          },
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o dia da semana em inglês, o horario de entrada e saída (hora e minuto) e o tempo de descanso em minutos",
            message: "Formato do corpo da requisição inválido",
          },
        });
      });
    });

    describe.each([
      ["startHour", "startHour"],
      ["startMinute", "startMinute"],
      ["endHour", "endHour"],
      ["endMinute", "endMinute"],
      ["restTimeInMinutes", "restTimeInMinutes"],
    ])("Validação de campos obrigatórios", (label, field) => {
      it(`should be return error if invalid ${label} is provided`, async () => {
        await expectations({
          cookie: author1Cookie,
          workerId: worker1Id,
          body: {
            schedule: {
              ...validSchedule,
              monday: { ...validEntryAndExit, [field]: "oito" },
            },
          },
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o dia da semana em inglês, o horario de entrada e saída (hora e minuto) e o tempo de descanso em minutos",
            message: "Formato do corpo da requisição inválido",
          },
        });
      });
    });

    describe("invalid week day", async () => {
      it("should return error if invalid week day is provided", async () => {
        await expectations({
          cookie: author1Cookie,
          workerId: worker1Id,
          body: { schedule: { ...validSchedule, segunda: validEntryAndExit } },
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o dia da semana em inglês, o horario de entrada e saída (hora e minuto) e o tempo de descanso em minutos",
            message: "Formato do corpo da requisição inválido",
          },
        });
      });
    });
  });
  describe("Succefull case", async () => {
    it("should be possible to set worker schedule", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: worker1Id,
        body: { schedule: validSchedule },
        expectedStatusCode: 201,
        expectedResponseData: {
          action: "Contate o suporte.",
          message: "Usuário não tem permissão para fazer essa operação.",
        },
      });
    });
  });

  describe("Authenticated manager from estabilhemnt", () => {
    describe("Succefull case", async () => {
      it("should be possible to set worker schedule", async () => {
        await expectations({
          cookie: manager2Cookie,
          workerId: worker2Id,
          body: { schedule: validSchedule },
          expectedStatusCode: 201,
          expectedResponseData: {
            action: "Contate o suporte.",
            message: "Usuário não tem permissão para fazer essa operação.",
          },
        });
      });
    });
  });
});
