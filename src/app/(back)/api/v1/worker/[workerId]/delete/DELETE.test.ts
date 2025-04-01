import { resetAllDatabase } from "@/prisma/prisma";
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";
import { describe, it, expect, beforeAll } from "vitest";

let worker1ID: string;
let worker1Cookie: string;
let manager1ID: string;
let manager1Cookie: string;
let author1Cookie: string;

let worker2ID: string;
let manager2ID: string;

beforeAll(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  worker1ID = scenario1.worker.id;
  worker1Cookie = scenario1.worker.cookie;
  manager1ID = scenario1.manager.id;
  manager1Cookie = scenario1.manager.cookie;
  author1Cookie = scenario1.author.cookies;

  const scenario2 = await createScenario2();
  worker2ID = scenario2.worker.id;
  manager2ID = scenario2.manager.id;
});

const deleteFetch = async (cookie: string, workerId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/worker/${workerId}/delete`,
    {
      headers: { cookie },
      method: "DELETE",
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  cookie,
  workerId,
  expectedResponseData,
  expectedStatusCode = 200,
}: {
  cookie: string;
  workerId: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const { response, data } = await deleteFetch(cookie, workerId);

  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status === 401) {
    expect(data).toStrictEqual({
      action: "Contate o suporte",
      message: "Usuário não autorizado",
    });
  } else if (response.status === 403) {
    expect(data).toStrictEqual({
      action: "Contate o suporte",
      message: "Usuário não tem permissão para fazer essa operação.",
    });
  } else if (response.status === 200) {
    expect(data).toStrictEqual({
      message: "Funcionário excluido com sucesso",
    });
  } else {
    expect(data).toStrictEqual(expectedResponseData);
  }
};

describe("DELETE on `/api/v1/worker/:id/delete`", () => {
  describe("Anonymous user", () => {
    it("shoud be return error if cookie is not provided", async () => {
      await expectations({
        cookie: "",
        workerId: worker1ID,
        expectedStatusCode: 401,
      });
    });
    it("shoud be return error if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
        workerId: worker1ID,
        expectedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worker", () => {
    it("shoud be return error if authenticated worker try to delete yourself", async () => {
      await expectations({
        cookie: worker1Cookie,
        workerId: worker1ID,
        expectedStatusCode: 403,
      });
    });

    it("shoud be return error if authenticated worker try to delete another worker", async () => {
      await expectations({
        cookie: worker1Cookie,
        workerId: worker2ID,
        expectedStatusCode: 403,
      });
    });

    it("shoud be return error if authenticated worker try to delete manager", async () => {
      await expectations({
        cookie: worker1Cookie,
        workerId: manager1ID,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("shoud be return error if authenticated manager try to delete yourself", async () => {
      await expectations({
        cookie: manager1Cookie,
        workerId: manager1ID,
        expectedStatusCode: 403,
      });
    });

    it("shoud be return error if authenticated manager try to delete any worker", async () => {
      await expectations({
        cookie: manager1Cookie,
        workerId: worker1ID,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated author", () => {
    it("shoud be possible to author delete worker from your establishment", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: worker1ID,
        expectedStatusCode: 200,
      });
    });

    it("shoud be possible to author delete manager from your establishment", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: manager1ID,
        expectedStatusCode: 200,
      });
    });

    it("shoud not be possible to manager delete worker from another establishment", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: worker2ID,
        expectedStatusCode: 403,
      });
    });

    it("shoud not be possible to author delete manager from another establishment", async () => {
      await expectations({
        cookie: author1Cookie,
        workerId: manager2ID,
        expectedStatusCode: 403,
      });
    });
  });
});
