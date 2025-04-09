import { resetAllDatabase } from "@/prisma/prisma";
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";
import {
  createScenario1,
  createScenario2,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";
import { describe, it, expect, beforeAll } from "vitest";

let scenario1: IScenario;
let scenario2: IScenario;

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
  scenario2 = await createScenario2();

  for (let index = 0; index < 10; index++) {
    const date = new Date();
    date.setUTCDate(index);
    await clockinModel.register({
      workerId: scenario1.worker.id,
      clocked_at: date,
      lat: 0,
      lng: 0,
    });
  }
});

const listClockinFetch = async ({
  establishmentId,
  cookie,
  page,
  pageSize,
}: {
  establishmentId?: string;
  pageSize?: number | string;
  page?: number | string;
  cookie: string;
}) => {
  const establishmentQuery = establishmentId
    ? `establishmentId=${establishmentId}&`
    : "";
  const pageQuery = page ? `page=${page}&` : "";
  const pageSizeQuery = pageSize ? `pageSize=${pageSize}&` : "";
  const response = await fetch(
    `http://localhost:3000/api/v1/clockin/listByEstablishment?` +
      establishmentQuery +
      pageQuery +
      pageSizeQuery,
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
  establishmentId,
  cookie = "",
  page = 1,
  pageSize = 10,
  expectedStatusCode = 200,
  expectedResponseData,
  log = false,
}: {
  establishmentId: string;
  pageSize?: number | string;
  page?: number | string;
  cookie?: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
  log?: boolean;
}) => {
  const { response, data } = await listClockinFetch({
    establishmentId,
    pageSize,
    page,
    cookie,
  });
  if (log) console.log(data);

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
  else if (response.status === 200) {
    expect(data).toStrictEqual({
      lastRegisters: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          clocked_at: expect.any(String),
          is_entry: expect.any(Boolean),
          worker: {
            name: expect.any(String),
            email: expect.any(String),
          },
        }),
      ]),
    });
  } else expect(data).toStrictEqual(expectedResponseData);
};
describe("GET on `/api/v1/clockin/listByEstablishment?establishmentId=[establishmentId]&page=[number]&pageSize=[number]`", () => {
  describe("Anonymous user", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 401,
      });
    });

    it("should be return error message if invalid cookie is provided", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 401,
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
      });
    });
  });

  describe("Valid manager from another establishment", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        cookie: scenario2.manager.cookie,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Valid author from another establishment", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        cookie: scenario2.author.cookies,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Valid author from establishment", () => {
    it("should be return last registers", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        cookie: scenario1.author.cookies,
      });
    });
  });

  describe("Valid manager from establishment", () => {
    it("should be return last registers", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        cookie: scenario1.manager.cookie,
      });
    });

    describe("Establishment ID tests", () => {
      it("should be return error if establishmetId is not provided", async () => {
        await expectations({
          establishmentId: "",
          cookie: scenario1.manager.cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            action: "Informe o ID do estabelecimento na URL",
            message: "ID do estabelecimento não informado",
          },
        });
      });

      it("should be return error if invalid establishmetId is provided", async () => {
        await expectations({
          establishmentId: "invalidEstablishmentId",
          cookie: scenario1.manager.cookie,
          expectedStatusCode: 404,
          expectedResponseData: {
            message: "Estabelecimento não encontrado",
            action: "Verifique o ID do estabelecimento",
          },
        });
      });
      it("should be return error if establishmentId is not provided", async () => {
        const { response, data } = await listClockinFetch({
          cookie: scenario1.manager.cookie,
          page: 1,
          pageSize: 10,
        });

        expect(response.status).toStrictEqual(400);
        expect(data).toStrictEqual({
          action: "Informe o ID do estabelecimento na URL",
          message: "ID do estabelecimento não informado",
        });
      });
    });

    describe("PAGE tests", () => {
      it("should be return error if invalid page is provided", async () => {
        await expectations({
          establishmentId: scenario1.establishment.id,
          cookie: scenario1.manager.cookie,
          page: "nove",
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "A página e a quantidade devem ser valores numéricos maiores que 0",
            message: "Página e quantidade por página inválidos",
          },
        });
      });

      it("should be return error if invalid page is not provided", async () => {
        const { response, data } = await listClockinFetch({
          establishmentId: scenario1.establishment.id,
          cookie: scenario1.manager.cookie,
          pageSize: 10,
        });

        expect(response.status).toStrictEqual(400);
        expect(data).toStrictEqual({
          message: "Página e quantidade por página inválidos",
          action:
            "A página e a quantidade devem ser valores numéricos maiores que 0",
        });
      });
    });

    describe("PAGESIZE TESTS", () => {
      it("should be return error if invalid pageSize is provided", async () => {
        await expectations({
          establishmentId: scenario1.establishment.id,
          cookie: scenario1.manager.cookie,
          pageSize: "nove",
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "A página e a quantidade devem ser valores numéricos maiores que 0",
            message: "Página e quantidade por página inválidos",
          },
        });
      });

      it("should be return error if invalid pageSize is provided", async () => {
        await expectations({
          establishmentId: scenario1.establishment.id,
          cookie: scenario1.manager.cookie,
          pageSize: -10,
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "A página e a quantidade devem ser valores numéricos maiores que 0",
            message: "Página e quantidade por página inválidos",
          },
        });
      });

      it("should be return error if invalid pageSize is provided", async () => {
        await expectations({
          establishmentId: scenario1.establishment.id,
          cookie: scenario1.manager.cookie,
          page: -10,
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "A página e a quantidade devem ser valores numéricos maiores que 0",
            message: "Página e quantidade por página inválidos",
          },
        });
      });

      it("should be return error if invalid pageSize is not provided", async () => {
        const { response, data } = await listClockinFetch({
          establishmentId: scenario1.establishment.id,
          cookie: scenario1.manager.cookie,
          page: 10,
        });

        expect(response.status).toStrictEqual(400);
        expect(data).toStrictEqual({
          message: "Página e quantidade por página inválidos",
          action:
            "A página e a quantidade devem ser valores numéricos maiores que 0",
        });
      });
    });
  });
});
