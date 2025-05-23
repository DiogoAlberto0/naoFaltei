import { resetAllDatabase } from "@/prisma/prisma";
import {
  authenticateRoot,
  createManyAuthors,
  createScenario1,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";
import { describe, it, expect, beforeAll } from "vitest";

let scenario1: IScenario;
let rootCookie: string;

const getMetricsAccount = async ({
  cookie,
  period,
  inicialDate,
  finalDate,
}: {
  cookie: string;
  period?: string;
  inicialDate?: string;
  finalDate?: string;
}) => {
  const params = new URLSearchParams();

  if (inicialDate) params.append("inicialDate", inicialDate);
  if (finalDate) params.append("finalDate", finalDate);
  if (period) params.append("period", period);

  const searchParams = `?${params.toString()}`;

  const response = await fetch(
    `http://localhost:3000/api/v1/metrics/countManagerAccounts${searchParams}`,
    {
      headers: {
        cookie,
      },
    },
  );

  const data = await response.json();
  return {
    response,
    data,
  };
};
beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
  rootCookie = await authenticateRoot();

  await createManyAuthors();
});

describe("GET on `/api/v1/metrics/countManagerAccounts`", () => {
  describe("Anonymous user", () => {
    it("should be return unauthorized error", async () => {
      const { response, data } = await getMetricsAccount({
        cookie: "",
      });

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("worker user", () => {
    it("should be return unauthorized error", async () => {
      const { response, data } = await getMetricsAccount({
        cookie: scenario1.worker.cookie,
      });

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("manager user", () => {
    it("should be return unauthorized error", async () => {
      const { response, data } = await getMetricsAccount({
        cookie: scenario1.manager.cookie,
      });

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("author user", () => {
    it("should be return unauthorized error", async () => {
      const { response, data } = await getMetricsAccount({
        cookie: scenario1.author.cookies,
      });

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("root user", () => {
    it("should be return author accounts metrics from last 2 months grouped by day if any search params is provided", async () => {
      const { response, data } = await getMetricsAccount({
        cookie: rootCookie,
      });

      expect(response.status).toStrictEqual(200);
      expect(data.totalManagers).toStrictEqual(21);
      expect(data.period).toStrictEqual("day");
      expect(Object.entries(data.newUsersPerPeriod).length).toStrictEqual(21);
    });

    it("should be return author accounts metrics from last 1 months grouped by day if inicialDate and finalDate params is provided", async () => {
      const inicialDate = new Date();
      inicialDate.setUTCDate(1);

      const finalDate = new Date();

      const { response, data } = await getMetricsAccount({
        cookie: rootCookie,
        inicialDate: inicialDate.toISOString(),
        finalDate: finalDate.toISOString(),
      });
      expect(response.status).toStrictEqual(200);

      expect(data.totalManagers).toStrictEqual(21);
      expect(data.period).toStrictEqual("day");
      Object.entries(data.newUsersPerPeriod).forEach(([key, value]) => {
        const date = new Date(key);
        expect(date.getUTCMonth()).toStrictEqual(inicialDate.getUTCMonth());
        expect(value).toStrictEqual(1);
      });
    });

    it("should be return author accounts metrics grouped by day", async () => {
      const { response, data } = await getMetricsAccount({
        cookie: rootCookie,
        period: "week",
      });
      expect(response.status).toStrictEqual(200);

      console.log(data);
      expect(data.totalManagers).toStrictEqual(21);
      expect(data.period).toStrictEqual("week");
      Object.entries(data.newUsersPerPeriod);
    });
  });
});
