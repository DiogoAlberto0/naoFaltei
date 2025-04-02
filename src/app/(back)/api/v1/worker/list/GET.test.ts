import { describe, it, expect, beforeAll } from "vitest";

import { prisma, resetAllDatabase } from "@/prisma/prisma";

import {
  createManyWorkers,
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";

let scenario1: {
  author: {
    id: string;
    cookies: string;
  };
  manager: {
    id: string;
    cookie: string;
  };
  worker: {
    id: string;
    cookie: string;
  };
  establishment: {
    id: string;
  };
};
let scenario2: {
  author: {
    id: string;
    cookies: string;
  };
  manager: {
    id: string;
    cookie: string;
  };
  worker: {
    id: string;
    cookie: string;
  };
  establishment: {
    id: string;
  };
};
beforeAll(async () => {
  await resetAllDatabase();
  scenario1 = await createScenario1();
  await createManyWorkers(scenario1.establishment.id);

  scenario2 = await createScenario2();
});

const listFetch = async ({
  cookie,
  establishmentId,
  page,
  pageSize,
}: {
  cookie?: string;
  establishmentId?: string;
  page?: number;
  pageSize?: number;
}) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/worker/list?establishmentId=${establishmentId}&page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: cookie ? { cookie } : undefined,
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  cookie,
  establishmentId,
  page = 2,
  pageSize = 2,
  expectedStatusCode,
  expectedResponseData,
}: {
  cookie?: string;
  establishmentId?: string;
  page?: number;
  pageSize?: number;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const { response, data } = await listFetch({
    cookie,
    establishmentId: establishmentId,
    pageSize,
    page,
  });

  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status === 401)
    expect(data).toStrictEqual({
      action: "Faça login no site",
      message: "Usuário não autorizado",
    });
  else if (response.status === 403)
    expect(data).toStrictEqual({
      action: "Contate o suporte.",
      message: "Usuário não tem permissão para fazer essa operação.",
    });
  else if (response.status === 200) {
    const expectedWorkers = await prisma.workers.findMany({
      where: {
        establishment: { id: establishmentId },
      },
      select: { name: true, email: true, id: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { name: "asc" },
    });
    const workerCounter = await prisma.workers.count({
      where: { establishment: { id: establishmentId } },
    });
    expect(data.workers).toStrictEqual(expectedWorkers);
    expect(data.meta).toStrictEqual({
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(workerCounter / pageSize),
      totalItems: workerCounter,
    });
  } else expect(data).toStrictEqual(expectedResponseData);
};
describe("GET on `/api/v1/worker/list`", () => {
  describe("Anonymous user", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 401,
      });
    });
    it("should be return error message if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 401,
      });
    });
  });

  describe("Auhtenticated worker", () => {
    it("should be return error message if worker try to list workers from your establishment", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 403,
      });
    });
    it("should be return error message if worker try to list workers from another establishment", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        establishmentId: scenario2.establishment.id,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Auhtenticated manager", () => {
    it("should return error if manager try to list workers from another establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: scenario2.establishment.id,
        expectedStatusCode: 403,
      });
    });

    it("should return error if invalid establishmentId is provided", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: "invalidEstablishmentId",
        expectedStatusCode: 404,
        expectedResponseData: {
          action: "Verifique o ID do estabelecimento",
          message: "Estabelecimento não encontrado",
        },
      });
    });

    it("should return error if negative page is provided", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: "invalidEstablishmentId",
        page: -1,
        expectedStatusCode: 400,
        expectedResponseData: {
          action:
            "Favor invormar os parâmetros page e pageSize como inteiros maior que 0",
          message: "Parâmetros de paginação inválidos",
        },
      });
    });

    it("should return error if negative pageSize is provided", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: "invalidEstablishmentId",
        pageSize: -1,
        expectedStatusCode: 400,
        expectedResponseData: {
          action:
            "Favor invormar os parâmetros page e pageSize como inteiros maior que 0",
          message: "Parâmetros de paginação inválidos",
        },
      });
    });

    it("should return error if establishmentId is not provided", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 404,
        expectedResponseData: {
          action: "Verifique o ID do estabelecimento",
          message: "Estabelecimento não encontrado",
        },
      });
    });

    it("should be return workers if valid manager try to list workers from your establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
      });
    });

    it("should be return workers if valid manager try to list workers from your establishment with pagination", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
        page: 1,
        pageSize: 5,
      });
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
        page: 2,
        pageSize: 5,
      });
    });
  });

  describe("Auhtenticated author", () => {
    it("should return error if author try to list workers from another establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        establishmentId: scenario2.establishment.id,
        expectedStatusCode: 403,
      });
    });

    it("should be return workers if valid author try to list workers from your establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
      });
    });

    it("should be return workers if valid author try to list workers from your establishment with pagination", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
        page: 1,
        pageSize: 5,
      });
      await expectations({
        cookie: scenario1.author.cookies,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
        page: 2,
        pageSize: 5,
      });
    });
  });
});
