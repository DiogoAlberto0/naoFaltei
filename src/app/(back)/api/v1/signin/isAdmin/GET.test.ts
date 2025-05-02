import { resetAllDatabase } from "@/prisma/prisma";
import {
  createScenario1,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";
import { beforeAll, describe, it, expect } from "vitest";

let scenario1: IScenario;

beforeAll(async () => {
  await resetAllDatabase();
  scenario1 = await createScenario1();
});

const sessionFetch = async (cookie: string) => {
  const response = await fetch("http://localhost:3000/api/v1/signin/isAdmin", {
    method: "GET",
    headers: {
      cookie,
    },
  });

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  cookie,
  expectedStatusCode,
}: {
  cookie?: string;
  expectedStatusCode?: number;
}) => {
  const { response, data } = await sessionFetch(cookie || "");
  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status === 401) {
    expect(data).toStrictEqual({
      message: "Usuário não autorizado",
      action: "Faça login no site",
    });
  }
  return { data };
};
describe("GET on `/api/v1/worker/isAdmin`", () => {
  describe("Anonymous user", () => {
    it("should be return error", async () => {
      const { data } = await expectations({
        cookie: "Any cookie token",
        expectedStatusCode: 401,
      });

      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });
  describe("Valid worker", () => {
    it("should be return false", async () => {
      const { data } = await expectations({
        cookie: scenario1.worker.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        is_admin: false,
      });
    });
  });

  describe("Valid manager", () => {
    it("should be return false", async () => {
      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        is_admin: false,
      });
    });
  });

  describe("Valid author", () => {
    it("should be return false", async () => {
      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        is_admin: true,
      });
    });
  });
});
