import { describe, it, expect, beforeAll } from "vitest";

import { resetAllDatabase } from "@/prisma/prisma";

// models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
// valid entitys for test
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";

let author1Cookie: string;
let manager1Cookie: string;
let worker1cookie: string;
let establishment1Id: string;

let author2Cookie: string;
let manager2Cookie: string;
let worker2cookie: string;
let establishment2Id: string;

beforeAll(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  author1Cookie = scenario1.author.cookies;
  manager1Cookie = scenario1.manager.cookie;
  worker1cookie = scenario1.worker.cookie;
  establishment1Id = scenario1.establishment.id;

  const scenario2 = await createScenario2();
  author2Cookie = scenario2.author.cookies;
  manager2Cookie = scenario2.manager.cookie;
  worker2cookie = scenario2.worker.cookie;
  establishment2Id = scenario2.establishment.id;
});

const listFetch = async ({ cookie }: { cookie: string }) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/establishment/list",
    {
      method: "GET",
      headers: { cookie },
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async (
  cookie: string,
  establishmentId: string,
  establishmentLength: number,
  expectedStatusCode?: number,
  expectedResponseData?: any,
) => {
  const establishment = await establishmentModel.findBy({
    id: establishmentId,
  });
  const { response, data } = await listFetch({ cookie });

  expect(response.status).toEqual(expectedStatusCode || 200);

  if (response.status != 200) {
    expect(data).toStrictEqual(expectedResponseData);
    return;
  }
  expect(data.establishments).toBeInstanceOf(Array);
  expect(data.establishments).toHaveLength(establishmentLength);

  if (data.establishments.length > 0) {
    expect(data.establishments[0]).toStrictEqual({
      id: establishment?.id,
      name: establishment?.name,
    });
  }
};
describe("GET on /api/v1/establishment/list", () => {
  describe("Valid author 1 Authenticated", () => {
    it("should return 1 establishment", async () => {
      await expectations(author1Cookie, establishment1Id, 1);
    });
  });

  describe("Valid manager 1 Authenticated", () => {
    it("should return 0 establishment", async () => {
      await expectations(manager1Cookie, establishment1Id, 0);
    });
  });

  describe("Valid author 1 Authenticated", () => {
    it("should return  1 establishment", async () => {
      await expectations(worker1cookie, establishment1Id, 0);
    });
  });

  describe("Valid author 2 Authenticated", () => {
    it("should return 2 establishment", async () => {
      await expectations(author2Cookie, establishment2Id, 1);
    });
  });

  describe("Valid manager 2 Authenticated", () => {
    it("should return 0 establishment", async () => {
      await expectations(manager2Cookie, establishment2Id, 0);
    });
  });

  describe("Valid author 2 Authenticated", () => {
    it("should return  2 establishment", async () => {
      await expectations(worker2cookie, establishment2Id, 0);
    });
  });

  describe("Unauthorized user", () => {
    it("should return error", async () => {
      await expectations("worker2cookie", establishment2Id, 0, 401, {
        action: "Faça login no site",
        message: "Usuário não autorizado",
      });
    });
  });
});
