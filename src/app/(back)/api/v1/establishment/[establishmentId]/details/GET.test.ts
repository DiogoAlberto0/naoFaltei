import { omit } from "lodash";

import { describe, it, beforeAll, expect } from "vitest";

import { prisma, resetAllDatabase } from "@/prisma/prisma";
import {
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
  scenario2 = await createScenario2();
});

const getFetch = async (cookie: string, establishmentId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/establishment/${establishmentId}/details`,
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
  establishmentId,
  expectedStatusCode = 200,
  expectedResponseData,
}: {
  cookie: string;
  establishmentId: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const { response, data } = await getFetch(cookie, establishmentId);

  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status === 401)
    expect(data).toStrictEqual({
      message: "Usuário não autorizado",
      action: "Faça login no site",
    });
  else if (response.status === 403)
    expect(data).toStrictEqual({
      message: "Usuário não tem permissão para fazer essa operação.",
      action: "Contate o suporte.",
    });
  else if (response.status == 200) {
    const cleanedData = omit(data, "created_at", "updated_at");
    const expectedEstablishment = await prisma.establishment.findUnique({
      where: { id: establishmentId },
    });
    if (!expectedEstablishment) throw new Error("Establishment not found");
    const cleanedEstablishment = omit(
      expectedEstablishment,
      "created_at",
      "updated_at",
    );
    expect(cleanedData).toStrictEqual(cleanedEstablishment);
    expect(new Date(data.created_at).getTime()).toStrictEqual(
      new Date(expectedEstablishment.created_at).getTime(),
    );
    expect(new Date(data.updated_at).getTime()).toStrictEqual(
      new Date(expectedEstablishment.updated_at).getTime(),
    );
  } else expect(data).toStrictEqual(expectedResponseData);
};

describe("GET on `/api/v1/establishment/:id/details`", () => {
  describe("Anonymous user", () => {
    it("should be return error message if cookie is not provided", async () => {
      await expectations({
        cookie: "",
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 401,
      });
    });
    it("should be return error message if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worke", () => {
    it("should be return error if worker is from establishment", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 403,
      });
    });
    it("should be return error if worker is from another establishment", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        establishmentId: scenario2.establishment.id,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be return establishment if manager is from establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
      });
    });
    it("should be return error if manager is from another establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        establishmentId: scenario2.establishment.id,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated author", () => {
    it("should be return establishment if author is from establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        establishmentId: scenario1.establishment.id,
        expectedStatusCode: 200,
      });
    });
    it("should be return error if author is from another establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        establishmentId: scenario2.establishment.id,
        expectedStatusCode: 403,
      });
    });
  });
});
