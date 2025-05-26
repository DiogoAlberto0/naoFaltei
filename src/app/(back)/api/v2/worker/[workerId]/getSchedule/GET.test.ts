import { describe, it, expect, beforeAll } from "vitest";
import { resetAllDatabase } from "@/prisma/prisma";

// models
import { scheduleModuleV2 } from "@/src/app/(back)/models/scheduleV2/scheduleModuleV2";

// data for tests
import {
  createScenario1,
  createScenario2,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";

let scenario1: IScenario;

let scenario2: IScenario;

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();

  await scheduleModuleV2.createOrUpdate({
    workerId: scenario1.worker.id,
    type: "week",
    week_minutes: 480 * 6,
    daysOff: ["sunday"],
  });

  scenario2 = await createScenario2();
});

const getScheduleFetch = async (cookie: string, workerId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/v2/worker/${workerId}/getSchedule`,
    {
      headers: {
        cookie,
      },
    },
  );

  const data = await response.json();

  return { response, data };
};

describe("GET on `/api/v1/worker/:id/getSchedule", () => {
  describe("Anonymous user", () => {
    it("should be return error message if cookie is not provided", async () => {
      const { response, data } = await getScheduleFetch(
        "",
        scenario1.worker.id,
      );

      expect(response.status).toStrictEqual(401);

      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
    it("should be return error message if invalid cookie is provided", async () => {
      const { response, data } = await getScheduleFetch(
        "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
        scenario1.worker.id,
      );

      expect(response.status).toStrictEqual(401);

      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should be return error message if worker try to get schedule from another user", async () => {
      const { response, data } = await getScheduleFetch(
        scenario1.worker.cookie,
        scenario2.worker.id,
      );

      expect(response.status).toStrictEqual(403);

      expect(data).toStrictEqual({
        action: "Contate o suporte.",
        message: "Usuário não tem permissão para fazer essa operação.",
      });
    });
    it("should be possible to worker get yourself schedule", async () => {
      const { response, data } = await getScheduleFetch(
        scenario1.worker.cookie,
        scenario1.worker.id,
      );

      expect(response.status).toStrictEqual(200);

      expect(data).toStrictEqual({
        type: "week",
        week_minutes: 480 * 6,
        daysOff: ["sunday"],
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be return error message if invalid workerId is provided", async () => {
      const { response, data } = await getScheduleFetch(
        scenario1.worker.cookie,
        "invalidId",
      );

      expect(response.status).toStrictEqual(404);

      expect(data).toStrictEqual({
        action: "Verifique o ID informado do funcionário",
        message: "Funcionário não encontrado",
      });
    });
  });
  it("should be return error message if manager is not from worker establishment", async () => {
    const { response, data } = await getScheduleFetch(
      scenario1.manager.cookie,
      scenario2.worker.id,
    );

    expect(response.status).toStrictEqual(403);

    expect(data).toStrictEqual({
      action: "Contate o suporte.",
      message: "Usuário não tem permissão para fazer essa operação.",
    });
  });
  it("should be possible to manager get schedule from worker from your establishment", async () => {
    const { response, data } = await getScheduleFetch(
      scenario1.manager.cookie,
      scenario1.worker.id,
    );

    expect(response.status).toStrictEqual(200);

    expect(data).toStrictEqual({
      type: "week",
      week_minutes: 480 * 6,
      daysOff: ["sunday"],
    });
  });
});

describe("Authenticated author", () => {
  it("should be return error message if author is not from worker establishment", async () => {
    const { response, data } = await getScheduleFetch(
      scenario1.author.cookies,
      scenario2.worker.id,
    );

    expect(response.status).toStrictEqual(403);

    expect(data).toStrictEqual({
      action: "Contate o suporte.",
      message: "Usuário não tem permissão para fazer essa operação.",
    });
  });
  it("should be possible to author get schedule from worker from your establishment", async () => {
    const { response, data } = await getScheduleFetch(
      scenario1.author.cookies,
      scenario1.worker.id,
    );

    expect(response.status).toStrictEqual(200);

    expect(data).toStrictEqual({
      type: "week",
      week_minutes: 480 * 6,
      daysOff: ["sunday"],
    });
  });
});
