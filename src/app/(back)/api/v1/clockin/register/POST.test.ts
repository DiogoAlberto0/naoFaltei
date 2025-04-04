import { describe, it, beforeAll, expect } from "vitest";
import { resetAllDatabase } from "@/prisma/prisma";
import { createScenario1 } from "@/src/app/(back)/tests/entitysForTest";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { coordinateUtils } from "@/src/utils/coordinate";

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

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
});

const postClockIn = async (cookie: string, payload: any) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/clockin/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();
  return { response, data };
};

const expectations = async ({
  cookie,
  lat,
  lng,
  expectedResponseData,
  expectedStatusCode = 200,
}: {
  cookie: string;
  lat: string | number;
  lng: string | number;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const { response, data } = await postClockIn(cookie, { lat, lng });

  expect(response.status).toBe(expectedStatusCode);

  if (response.status == 401)
    expect(data).toStrictEqual({
      message: "Usuário não autorizado",
      action: "Faça login no site",
    });
  else if (response.status == 403)
    expect(data).toStrictEqual({
      message: "Usuário",
      action: "",
    });
  else if (response.status === 200) {
    expect(data).toStrictEqual({
      message: "Ponto registrado com sucesso",
    });
  } else {
    expect(data).toStrictEqual(expectedResponseData);
  }
  return { response, data };
};

describe("POST on `/api/v1/clockin`", () => {
  describe("Anonymous user", () => {
    it("should return unauthorized error if no cookie is provided", async () => {
      await expectations({
        cookie: "",
        lat: "",
        lng: "",
        expectedStatusCode: 401,
      });
    });

    it("should return unauthorized error if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
        lat: "",
        lng: "",
        expectedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should return error if worker is outside the establishment's range", async () => {
      const localeEstablishment = await establishmentModel.getLocaleInfos({
        establishmentId: scenario1.establishment.id,
      });

      if (!localeEstablishment)
        throw new Error(
          "Erro no teste, informacoes de localizacao do estabelecimento não encontrado",
        );

      const { distance } = coordinateUtils.isOnRatio(
        40.712776,
        -74.005974,
        localeEstablishment.lat,
        localeEstablishment.lng,
        localeEstablishment.ratio,
      );
      await expectations({
        cookie: scenario1.worker.cookie,
        lat: 40.712776,
        lng: -74.005974,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: `Você está fora do raio de atuação do establecimento. Raio de atuação: ${localeEstablishment.ratio}Km.`,
          action: `Se aproxime mais do estabelecimento. Sua distância: ${Math.round(distance)}Km.`,
        },
      });
    });

    it("should register clock-in if worker is inside the establishment's range and coordinates is string", async () => {
      const establishment = await establishmentModel.findBy({
        id: scenario1.establishment.id,
      });

      if (!establishment)
        throw new Error("Erro no teste, estabelecimento não encontrado");

      await expectations({
        cookie: scenario1.worker.cookie,
        lat: establishment.lat.toString(),
        lng: establishment.lng.toString(),
      });
    });

    it("should register clock-in if worker is inside the establishment's range and coordinates is number", async () => {
      const establishment = await establishmentModel.findBy({
        id: scenario1.establishment.id,
      });

      if (!establishment)
        throw new Error("Erro no teste, estabelecimento não encontrado");

      await expectations({
        cookie: scenario1.worker.cookie,
        lat: Number(establishment.lat),
        lng: Number(establishment.lng),
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should return error if manager is outside the establishment's range", async () => {
      const localeEstablishment = await establishmentModel.getLocaleInfos({
        establishmentId: scenario1.establishment.id,
      });

      if (!localeEstablishment)
        throw new Error(
          "Erro no teste, informacoes de localizacao do estabelecimento não encontrado",
        );

      const { distance } = coordinateUtils.isOnRatio(
        0,
        0,
        localeEstablishment.lat,
        localeEstablishment.lng,
        localeEstablishment.ratio,
      );
      await expectations({
        cookie: scenario1.manager.cookie,
        lat: 0,
        lng: 0,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: `Você está fora do raio de atuação do establecimento. Raio de atuação: ${localeEstablishment.ratio}Km.`,
          action: `Se aproxime mais do estabelecimento. Sua distância: ${Math.round(distance)}Km.`,
        },
      });
    });

    it("should register clock-in if manager is inside the establishment's range and coordinates is string", async () => {
      const establishment = await establishmentModel.findBy({
        id: scenario1.establishment.id,
      });

      if (!establishment)
        throw new Error("Erro no teste, estabelecimento não encontrado");

      await expectations({
        cookie: scenario1.manager.cookie,
        lat: establishment.lat.toString(),
        lng: establishment.lng.toString(),
      });
    });

    it("should register clock-in if manager is inside the establishment's range and coordinates is number", async () => {
      const establishment = await establishmentModel.findBy({
        id: scenario1.establishment.id,
      });

      if (!establishment)
        throw new Error("Erro no teste, estabelecimento não encontrado");

      await expectations({
        cookie: scenario1.manager.cookie,
        lat: Number(establishment.lat),
        lng: Number(establishment.lng),
      });
    });
  });
});
