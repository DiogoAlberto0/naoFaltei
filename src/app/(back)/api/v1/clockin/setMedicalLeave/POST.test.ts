import { resetAllDatabase } from "@/prisma/prisma";
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";
import { workDaySummaryModel } from "@/src/app/(back)/models/workDaySummary/workDaySummary";
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
});

const postMedicalLeave = async ({
  cookie = "",
  ...body
}: {
  cookie?: string;
  workerId?: any;
  inicialDate?: any;
  finalDate?: any;
}) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/clockin/setMedicalLeave",
    {
      method: "POST",
      headers: {
        cookie,
      },
      body: JSON.stringify({ ...body }),
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  cookie,
  workerId,
  inicialDate,
  finalDate,
  expextedStatusCode = 200,
  expectedResponseDate,
}: {
  cookie?: string;
  workerId?: string;
  inicialDate?: any;
  finalDate?: any;
  expextedStatusCode?: number;
  expectedResponseDate?: any;
}) => {
  const { response, data } = await postMedicalLeave({
    cookie,
    workerId,
    inicialDate,
    finalDate,
  });

  expect(response.status).toStrictEqual(expextedStatusCode);

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
  else if (response.status === 404)
    expect(data).toStrictEqual({
      action: "Verifique o ID do funcionário",
      message: "Funcionário nâo encontrado",
    });
  else if (response.status === 200)
    expect(data).toStrictEqual({
      message: "Atestado cadastrado com sucesso.",
    });
  else {
    expect(data).toStrictEqual(expectedResponseDate);
  }
};
describe("POST on `/api/v1/clockin/setMedicalLeave`", () => {
  describe("Anonymous user", () => {
    it("should return error if cookie is not provided", async () => {
      await expectations({
        cookie: "",
        expextedStatusCode: 401,
      });
    });

    it("should return error if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
        expextedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should return error authenticated worker try to set medical leave to yourself", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario1.worker.id,
        expextedStatusCode: 403,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });

    it("should return error authenticated worker try to set medical leave to another worker", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario2.worker.id,
        expextedStatusCode: 403,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });

    it("should return error authenticated worker try to set medical leave to another manager worker", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario1.manager.id,
        expextedStatusCode: 403,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });
  });
  describe("Authenticated manager", () => {
    it("should return error authenticated manager try to set medical leave to worker fromm another establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario2.worker.id,
        expextedStatusCode: 403,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });

    it("should return error authenticated manager try to set medical leave to yourselfment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.manager.id,
        expextedStatusCode: 403,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });

    it("should return error if inexistent worker id is provided", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: "inexistentWorkerId",
        expextedStatusCode: 404,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });

    it("should return error if invalid data is provided", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.worker.id,
        expextedStatusCode: 400,
        inicialDate: "2021-12-40",
        finalDate: "2021-12-25",
        expectedResponseDate: {
          action: "Verifique se o dia realmente existe nesse mês",
          message: "A data informada não é válida no calendário",
        },
      });

      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.worker.id,
        expextedStatusCode: 400,
        inicialDate: 123,
        finalDate: "2021-12-25",
        expectedResponseDate: {
          action: "Verifique se a data está no formato YYYY-MM-DD",
          message: "A data informada é inválida",
        },
      });

      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.worker.id,
        expextedStatusCode: 400,
        inicialDate: "dois de janeiro de 1994",
        finalDate: "2021-12-25",
        expectedResponseDate: {
          action: "Verifique se a data está no formato YYYY-MM-DD",
          message: "A data informada é inválida",
        },
      });
    });

    it("should register medical leave to worker from your establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.worker.id,
        expextedStatusCode: 200,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });

      const inicialDate = new Date("2021-12-25");
      const finalDate = new Date("2021-12-25");
      const registeredMedicalLeave = await clockinModel.getTimeSheetByWorker({
        workerId: scenario1.worker.id,
        inicialDate,
        finalDate,
      });

      expect(registeredMedicalLeave[0].is_medical_leave).toBeTruthy();
      expect(registeredMedicalLeave[0].time_balance).toStrictEqual(0);
    });
  });

  describe("Authenticated author", () => {
    it("should return error authenticated author try to set medical leave to worker fromm another establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario2.worker.id,
        expextedStatusCode: 403,
        inicialDate: "2021-12-25",
        finalDate: "2021-12-25",
      });
    });

    it("should register medical leave to worker from your establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expextedStatusCode: 200,
        inicialDate: "2021-12-26",
        finalDate: "2021-12-26",
      });

      const inicialDate = new Date("2021-12-26");
      const finalDate = new Date("2021-12-26");
      const registeredMedicalLeave = await clockinModel.getTimeSheetByWorker({
        workerId: scenario1.worker.id,
        inicialDate,
        finalDate,
      });
      const totalSummary = await workDaySummaryModel.getTotalSumariesData(
        scenario1.worker.id,
        inicialDate,
        finalDate,
      );

      expect(registeredMedicalLeave[0].is_medical_leave).toBeTruthy();
      expect(registeredMedicalLeave[0].time_balance).toStrictEqual(0);
      expect(totalSummary).toStrictEqual({
        totalAbscent: 0,
        totalMedicalLeave: 1,
        totalTimeBalance: 0,
      });
    });
  });
});
