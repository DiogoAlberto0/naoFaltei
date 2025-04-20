import { describe, it, expect, beforeAll } from "vitest";

//prisma
import { prisma, resetAllDatabase } from "@/prisma/prisma";

//tests entitys
import {
  createScenario1,
  createScenario2,
  getSundayLastMonth,
  IScenario,
  setValidSchedule,
  setValidSchedule2,
} from "@/src/app/(back)/tests/entitysForTest";

//utils
import { dateUtils } from "@/src/utils/date";
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";

let scenario1: IScenario;

let scenario2: IScenario;

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
  await setValidSchedule(scenario1.worker.id);
  scenario2 = await createScenario2();
  await setValidSchedule2(scenario2.worker.id);
});

const postManagerRegister = async ({
  cookie,
  body,
}: {
  cookie: string;
  body: any;
}) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/clockin/managerRegister",
    {
      method: "POST",
      headers: {
        cookie,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  registers,
  workerId = "",
  cookie = "",
  expectedStatusCode = 201,
}: {
  registers?: any;
  workerId?: string;
  cookie?: string;
  expectedStatusCode?: number;
}) => {
  const { response, data } = await postManagerRegister({
    cookie,
    body: {
      workerId,
      registers,
    },
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

  return { data };
};
describe("POST on `/api/v1/clockin/managerRegister`", () => {
  describe("Anonymous user", () => {
    it("should return error if cookie is not provided", async () => {
      await expectations({
        expectedStatusCode: 401,
      });
    });

    it("should return error if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
        expectedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should be return error if worker try to register clockins to yourself", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario1.worker.id,
        expectedStatusCode: 403,
      });
    });

    it("should be return error if worker try to register clockins to another worker", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario2.worker.id,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be return error if manager try to register to worker from another establishment", async () => {
      await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario2.worker.id,
        expectedStatusCode: 403,
      });
    });

    it("should be return error if more than 30 register is provided", async () => {
      const registers = [];

      for (let index = 0; index < 31; index++) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + 1);
        registers.push({
          clockedAt: date,
          isEntry: index % 2 == 0,
        });
      }
      const { data } = await expectations({
        cookie: scenario2.manager.cookie,
        workerId: scenario2.worker.id,
        registers,
        expectedStatusCode: 400,
      });

      expect(data).toStrictEqual({
        action: "Reduza o numero de registros",
        message: "O máximo de registros por operação são 30",
      });
    });

    it("should be possible to register to a valid worker", async () => {
      const firstDay = getSundayLastMonth();
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      const secondDay = new Date(firstDay);
      secondDay.setUTCDate(secondDay.getUTCDate() + 1);

      const { data } = await expectations({
        cookie: scenario2.manager.cookie,
        workerId: scenario2.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(17, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(21, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(22, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(secondDay.setUTCHours(2, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });
      expect(data).toStrictEqual({
        message: "4 novos registros criados",
      });

      const summary = await prisma.workDaySummary.findFirst({
        where: {
          worker_id: scenario2.worker.id,
          work_date: {
            gte: dateUtils.getStartOfDay(firstDay),
            lte: dateUtils.getStartOfDay(firstDay),
          },
        },
      });
      expect(summary).toStrictEqual({
        id: expect.any(String),
        work_date: expect.any(Date),
        expected_minutes: 480,
        worked_minutes: 480,
        rested_minutes: 60,
        time_balance: 0,
        is_medical_leave: false,
        status: "present",
        worker_id: scenario2.worker.id,
      });

      const summary2 = await prisma.workDaySummary.findFirst({
        where: {
          worker_id: scenario2.worker.id,
          work_date: {
            gte: dateUtils.getStartOfDay(secondDay),
            lte: dateUtils.getStartOfDay(secondDay),
          },
        },
      });
      expect(summary2).toStrictEqual({
        id: expect.any(String),
        work_date: expect.any(Date),
        expected_minutes: 480,
        worked_minutes: 0,
        rested_minutes: 0,
        time_balance: -480,
        is_medical_leave: false,
        status: "present",
        worker_id: scenario2.worker.id,
      });
    });

    it("should return error if registers are empty", async () => {
      const { data } = await expectations({
        cookie: scenario2.manager.cookie,
        workerId: scenario2.worker.id,
        registers: [],
        expectedStatusCode: 400,
      });

      expect(data).toStrictEqual({
        message: "Nenhum registro foi informado",
        action: "Informe pelo menos 1 registro",
      });
    });

    it("should be possible to register to a valid worker in night schedule", async () => {
      const firstDay = getSundayLastMonth(new Date(2001, 12, 2));
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      const secondDay = new Date(firstDay);
      secondDay.setUTCDate(secondDay.getUTCDate() + 1);

      const thirdDay = new Date(secondDay);
      thirdDay.setUTCDate(thirdDay.getUTCDate() + 1);

      const { data } = await expectations({
        cookie: scenario2.manager.cookie,
        workerId: scenario2.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(17, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(23, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(secondDay.setUTCHours(0, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(secondDay.setUTCHours(2, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(secondDay.setUTCHours(16, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(secondDay.setUTCHours(23, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(thirdDay.setUTCHours(0, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(thirdDay.setUTCHours(2, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });

      expect(data).toStrictEqual({
        message: `8 novos registros criados`,
      });

      const summary1 = await prisma.workDaySummary.findFirstOrThrow({
        where: {
          worker_id: scenario2.worker.id,
          work_date: firstDay,
        },
      });

      expect(summary1.expected_minutes).toStrictEqual(480);
      expect(summary1.worked_minutes).toStrictEqual(540);
      expect(summary1.time_balance).toStrictEqual(60);

      const summary2 = await prisma.workDaySummary.findFirstOrThrow({
        where: {
          worker_id: scenario2.worker.id,
          work_date: secondDay,
        },
      });

      expect(summary2.expected_minutes).toStrictEqual(480);
      expect(summary2.worked_minutes).toStrictEqual(480);
      expect(summary2.time_balance).toStrictEqual(0);

      const summary3 = await prisma.workDaySummary.findFirstOrThrow({
        where: {
          worker_id: scenario2.worker.id,
          work_date: thirdDay,
        },
      });

      expect(summary3.expected_minutes).toStrictEqual(480);
      expect(summary3.worked_minutes).toStrictEqual(0);
      expect(summary3.time_balance).toStrictEqual(-480);

      const total = await clockinModel.getTotalSumariesData(
        scenario2.worker.id,
        firstDay,
        secondDay,
      );
      expect(total).toStrictEqual({
        totalAbscent: 0,
        totalMedicalLeave: 0,
        totalTimeBalance: 60,
      });

      const total2 = await clockinModel.getTotalSumariesData(
        scenario2.worker.id,
        firstDay,
        thirdDay,
      );
      expect(total2).toStrictEqual({
        totalAbscent: 0,
        totalMedicalLeave: 0,
        totalTimeBalance: -480 + 60,
      });
    });
  });

  describe("Authenticated author", () => {
    it("should be return error if author try to register to worker from another establishment", async () => {
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario2.worker.id,
        expectedStatusCode: 403,
      });
    });

    it("should be return error if more than 30 register is provided", async () => {
      const registers = [];

      for (let index = 0; index < 31; index++) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + 1);
        registers.push({
          clockedAt: date,
          isEntry: index % 2 == 0,
        });
      }
      const { data } = await expectations({
        cookie: scenario2.author.cookies,
        workerId: scenario2.worker.id,
        registers,
        expectedStatusCode: 400,
      });

      expect(data).toStrictEqual({
        action: "Reduza o numero de registros",
        message: "O máximo de registros por operação são 30",
      });
    });

    it("should be possible to register to a valid worker if the entry and the exit hours is equal the worker schedule", async () => {
      const firstDay = getSundayLastMonth();
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      const secondDay = new Date(firstDay);
      secondDay.setUTCDate(secondDay.getUTCDate() + 1);

      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(10, 30, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(14, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(15, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 30, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(17, 0, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(20, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });
      expect(data).toStrictEqual({
        message: "6 novos registros criados",
      });

      const summary = await prisma.workDaySummary.findFirst({
        where: {
          worker_id: scenario1.worker.id,
          work_date: {
            gte: dateUtils.getStartOfDay(firstDay),
            lte: dateUtils.getStartOfDay(firstDay),
          },
        },
      });
      expect(summary).toStrictEqual({
        id: expect.any(String),
        work_date: expect.any(Date),
        expected_minutes: 480,
        worked_minutes: 480,
        rested_minutes: 90,
        time_balance: 0,
        is_medical_leave: false,
        status: "present",
        worker_id: scenario1.worker.id,
      });
    });

    it("should return error if registers are empty", async () => {
      const { data } = await expectations({
        cookie: scenario2.author.cookies,
        workerId: scenario2.worker.id,
        registers: [],
        expectedStatusCode: 400,
      });

      expect(data).toStrictEqual({
        message: "Nenhum registro foi informado",
        action: "Informe pelo menos 1 registro",
      });
    });

    it("should be possible to register to a valid worker if he is late", async () => {
      const firstDay = getSundayLastMonth(new Date(2001, 12, 2));
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      const secondDay = new Date(firstDay);
      secondDay.setUTCDate(secondDay.getUTCDate() + 1);

      const thirdDay = new Date(secondDay);
      thirdDay.setUTCDate(thirdDay.getUTCDate() + 1);

      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(10, 45, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(14, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(15, 15, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 45, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(20, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });

      expect(data).toStrictEqual({
        message: `6 novos registros criados`,
      });

      const summary1 = await prisma.workDaySummary.findFirstOrThrow({
        where: {
          worker_id: scenario1.worker.id,
          work_date: firstDay,
        },
      });

      expect(summary1.expected_minutes).toStrictEqual(480);
      expect(summary1.worked_minutes).toStrictEqual(435);
      expect(summary1.time_balance).toStrictEqual(-45);

      const total2 = await clockinModel.getTotalSumariesData(
        scenario1.worker.id,
        firstDay,
        firstDay,
      );
      expect(total2).toStrictEqual({
        totalAbscent: 0,
        totalMedicalLeave: 0,
        totalTimeBalance: -45,
      });
    });

    it("should be possible to register to a valid worker if he is adianted", async () => {
      const firstDay = getSundayLastMonth(new Date(2001, 11, 2));
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      const secondDay = new Date(firstDay);
      secondDay.setUTCDate(secondDay.getUTCDate() + 1);

      const thirdDay = new Date(secondDay);
      thirdDay.setUTCDate(thirdDay.getUTCDate() + 1);

      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(10, 15, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(14, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(14, 45, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 0, 0, 0)),
            isEntry: false,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 15, 0, 0)),
            isEntry: true,
          },
          {
            clockedAt: new Date(firstDay.setUTCHours(20, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });

      expect(data).toStrictEqual({
        message: `6 novos registros criados`,
      });

      const summary1 = await prisma.workDaySummary.findFirstOrThrow({
        where: {
          worker_id: scenario1.worker.id,
          work_date: firstDay,
        },
      });

      expect(summary1.expected_minutes).toStrictEqual(480);
      expect(summary1.worked_minutes).toStrictEqual(480 + 15 + 15 + 15);
      expect(summary1.time_balance).toStrictEqual(45);

      const total2 = await clockinModel.getTotalSumariesData(
        scenario1.worker.id,
        firstDay,
        firstDay,
      );
      expect(total2).toStrictEqual({
        totalAbscent: 0,
        totalMedicalLeave: 0,
        totalTimeBalance: 45,
      });
    });

    it("should be possible to register separated clockins to the same day", async () => {
      const firstDay = getSundayLastMonth(new Date(2001, 10, 2));
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(10, 30, 0, 0)),
            isEntry: true,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(14, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(15, 0, 0, 0)),
            isEntry: true,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 30, 0, 0)),
            isEntry: true,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(20, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });

      const summary1 = await prisma.workDaySummary.findFirstOrThrow({
        where: {
          worker_id: scenario1.worker.id,
          work_date: firstDay,
        },
      });

      expect(summary1.expected_minutes).toStrictEqual(480);
      expect(summary1.worked_minutes).toStrictEqual(480);
      expect(summary1.time_balance).toStrictEqual(0);

      const total2 = await clockinModel.getTotalSumariesData(
        scenario1.worker.id,
        firstDay,
        firstDay,
      );
      expect(total2).toStrictEqual({
        totalAbscent: 0,
        totalMedicalLeave: 0,
        totalTimeBalance: 0,
      });
    });

    it("should be return error if register is in conflict with an existent clockin", async () => {
      const firstDay = getSundayLastMonth(new Date(2001, 9, 2));
      firstDay.setUTCDate(firstDay.getUTCDate() + 1);

      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(10, 30, 0, 0)),
            isEntry: true,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(14, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(15, 0, 0, 0)),
            isEntry: true,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 0, 0, 0)),
            isEntry: false,
          },
        ],
      });
      await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 201,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(16, 30, 0, 0)),
            isEntry: true,
          },
        ],
      });
      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        expectedStatusCode: 400,
        registers: [
          {
            clockedAt: new Date(firstDay.setUTCHours(20, 0, 0, 0)),
            isEntry: true,
          },
        ],
      });

      expect(data).toStrictEqual({
        message: "Os registros devem ser alternados entre entradas e saídas",
        action:
          "Verifique os novos registros e se o funcionário já possui registros nessas datas",
      });
    });
  });
});
