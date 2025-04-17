import { resetAllDatabase } from "@/prisma/prisma";
import { workerModel } from "@/src/app/(back)/models/worker";
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";
import { describe, it, expect, beforeAll } from "vitest";
import { omit } from "lodash";

let worker1Id: string;
let worker1Cookie: string;
let manager1Cookie: string;
let author1Cookie: string;

let worker2Id: string;

beforeAll(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  worker1Id = scenario1.worker.id;
  worker1Cookie = scenario1.worker.cookie;
  manager1Cookie = scenario1.manager.cookie;
  author1Cookie = scenario1.author.cookies;

  const validEntryAndExit = {
    startHour: 10,
    startMinute: 30,
    endHour: 20,
    endMinute: 0,
    restTimeInMinutes: 90,
  };
  await workerModel.setSchedule({
    workerId: worker1Id,
    schedule: {
      sunday: validEntryAndExit,
      monday: validEntryAndExit,
      tuesday: validEntryAndExit,
      wednesday: validEntryAndExit,
      thursday: validEntryAndExit,
      friday: validEntryAndExit,
      saturday: validEntryAndExit,
    },
  });

  const scenario2 = await createScenario2();
  worker2Id = scenario2.worker.id;
});

const getScheduleFetch = async (cookie: string, workerId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/worker/${workerId}/details`,
    {
      headers: {
        cookie,
      },
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  cookie,
  workerId,
  expectedResponseData,
  expectedStatusCode,
  log = false,
}: {
  cookie: string;
  workerId: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
  log?: boolean;
}) => {
  const { response, data } = await getScheduleFetch(cookie, workerId);

  if (log) console.log({ response, data });
  expect(response.status).toStrictEqual(expectedStatusCode || 200);

  if (response.status === 200) {
    const workerFromDB = await workerModel.findUniqueBy({ id: workerId });

    expect(data).toStrictEqual(omit(workerFromDB, "hash"));
  } else if (response.status === 401) {
    expect(data).toStrictEqual({
      action: "Faça login no site",
      message: "Usuário não autorizado",
    });
  } else if (response.status === 403) {
    expect(data).toStrictEqual({
      action: "Contate o suporte.",
      message: "Usuário não tem permissão para fazer essa operação.",
    });
  } else expect(data).toStrictEqual(expectedResponseData);
};
describe("GET on `/api/v1/worker/:id/getSchedule", () => {
  describe("Anonymous user", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        cookie: "",
        workerId: worker1Id,
        expectedStatusCode: 401,
      });
    });
    it("should be return error message if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
        workerId: worker1Id,
        expectedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should be return error message if worker try to get schedule from another user", async () => {
      await expectations({
        cookie: worker1Cookie,
        workerId: worker2Id,
        expectedStatusCode: 403,
      });
    });
    it("should be possible to worker get yourself schedule", async () => {
      await expectations({
        cookie: worker1Cookie,
        workerId: worker1Id,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be return error message if invalid workerId is provided", async () => {
      await expectations({
        cookie: manager1Cookie,
        workerId: "invalidworkerid",
        expectedStatusCode: 404,
        expectedResponseData: {
          action: "Verifique o ID informado do funcionário",
          message: "Funcionário não encontrado",
        },
      });
    });
    it("should be return error message if manager is not from worker establishment", async () => {
      await expectations({
        cookie: manager1Cookie,
        workerId: worker2Id,
        expectedStatusCode: 403,
      });
    });
    it("should be possible to manager get schedule from worker from your establishment", async () => {
      await expectations({
        cookie: manager1Cookie,
        workerId: worker1Id,
      });
    });
  });

  describe("Authenticated author", () => {
    it("should be return error message if author is not from worker establishment", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: worker2Id,
        expectedStatusCode: 403,
      });
    });
    it("should be possible to author get schedule from worker from your establishment", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: worker1Id,
      });
    });
  });
});
