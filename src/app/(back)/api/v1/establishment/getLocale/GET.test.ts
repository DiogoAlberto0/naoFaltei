import { describe, it, expect, beforeAll } from "vitest";

// data tests
import { resetAllDatabase } from "@/prisma/prisma";
import {
  createScenario1,
  createScenario2,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";

import { establishmentModel } from "@/src/app/(back)/models/establishment";

let scenario1: IScenario;
let scenario2: IScenario;

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
  scenario2 = await createScenario2();
});

const getLocaleFetch = async ({ cookie }: { cookie: string }) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/establishment/getLocale`,
    {
      headers: {
        cookie,
      },
    },
  );

  let data: any = undefined;
  try {
    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  return { response, data };
};

const expectations = async ({
  cookie = "",
  expectedStatusCode = 200,
}: {
  cookie?: string;
  establishmentId?: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const { response, data } = await getLocaleFetch({
    cookie,
  });

  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status === 401)
    expect(data).toStrictEqual({
      message: "Usuário não autorizado",
      action: "Faça login no site",
    });
  else if (response.status === 403)
    expect(data).toStrictEqual({
      action: "Contate o suporte.",
      message: "Usuário não tem permissão para fazer essa operação.",
    });

  return {
    data,
  };
};
describe("GET on `/api/v1/establishent/[:establishmentId]/getLocale`", () => {
  describe("Anonymous user", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        expectedStatusCode: 401,
      });
    });

    it("should be return error message if invalid cookie is provided", async () => {
      await expectations({
        expectedStatusCode: 401,
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should be locale from establishment from authenticated worker", async () => {
      const establishent = await establishmentModel.findBy({
        id: scenario1.establishment.id,
      });
      const { data } = await expectations({
        cookie: scenario1.worker.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lat: establishent?.lat,
        lng: establishent?.lng,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be locale from establishment from authenticated manager", async () => {
      const establishent = await establishmentModel.findBy({
        id: scenario1.establishment.id,
      });
      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lat: establishent?.lat,
        lng: establishent?.lng,
      });

      const establishent2 = await establishmentModel.findBy({
        id: scenario2.establishment.id,
      });
      const { data: data2 } = await expectations({
        cookie: scenario2.manager.cookie,
        expectedStatusCode: 200,
      });

      expect(data2).toStrictEqual({
        lat: establishent2?.lat,
        lng: establishent2?.lng,
      });
    });
  });
});
