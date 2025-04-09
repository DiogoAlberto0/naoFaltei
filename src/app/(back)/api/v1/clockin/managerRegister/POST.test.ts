import { describe, it, expect, beforeAll } from "vitest";

//prisma
import { prisma, resetAllDatabase } from "@/prisma/prisma";

//tests entitys
import {
  createScenario1,
  createScenario2,
  createWorkerRegisterDay,
  getSundayLastMonth,
  IScenario,
  setValidSchedule,
} from "@/src/app/(back)/tests/entitysForTest";

//utils
import { dateUtils } from "@/src/utils/date";

let scenario1: IScenario;

let scenario2: IScenario;

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
  await setValidSchedule(scenario1.worker.id);
  scenario2 = await createScenario2();
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
    it("should return error if worker try to register clockin to yourself", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario1.worker.id,
        registers: [],
        expectedStatusCode: 403,
      });
    });

    it("should return error if worker try to register clockin to another worker", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario2.worker.id,
        registers: [],
        expectedStatusCode: 403,
      });
    });

    it("should return error if worker try to register clockin to manager", async () => {
      await expectations({
        cookie: scenario1.worker.cookie,
        workerId: scenario1.manager.id,
        registers: [],
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be possible to register mutiples clockins to a valid worker", async () => {
      const date = getSundayLastMonth(new Date(new Date().setMonth(0)));
      date.setUTCDate(date.getUTCDate() + 1);
      const times = [
        { isEntry: true, hour: 10, minute: 30 },
        { isEntry: false, hour: 14, minute: 0 },
        { isEntry: true, hour: 15, minute: 0 },
        { isEntry: false, hour: 16, minute: 30 },
        { isEntry: true, hour: 17, minute: 0 },
        { isEntry: false, hour: 20, minute: 0 },
      ];

      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.worker.id,
        registers: times.map((time) => ({
          clockedAt: new Date(date.setUTCHours(time.hour, time.minute, 0, 0)),
        })),
        expectedStatusCode: 201,
      });

      expect(data.message).toStrictEqual("6 novos registros criados");

      //verificando registros
      const createdRegister = await prisma.clockin.findMany({
        where: {
          worker_id: scenario1.worker.id,
          clocked_at: {
            gte: dateUtils.getStartOfDay(date),
            lte: dateUtils.getEndOfDay(date),
          },
        },
        orderBy: {
          clocked_at: "asc",
        },
      });
      times.forEach((time, index) => {
        expect(createdRegister[index]).toStrictEqual({
          id: expect.any(String),
          clocked_at: expect.any(Date),
          is_entry: time.isEntry,
          lat: -23.55052,
          lng: -46.633308,
          worker_id: scenario1.worker.id,
          registered_by: scenario1.manager.id,
        });
        expect(createdRegister[index].clocked_at.getUTCHours()).toStrictEqual(
          time.hour,
        );
        expect(createdRegister[index].clocked_at.getUTCMinutes()).toStrictEqual(
          time.minute,
        );
      });

      //verificando resumos
      const summaryDay = await prisma.workDaySummary.findUnique({
        where: {
          worker_id_work_date: {
            worker_id: scenario1.worker.id,
            work_date: dateUtils.getStartOfDay(date),
          },
        },
      });

      expect(summaryDay).toStrictEqual({
        expected_minutes: 480,
        id: expect.any(String),
        is_medical_leave: false,
        rested_minutes: 90,
        status: "present",
        time_balance: 0,
        work_date: dateUtils.getStartOfDay(date),
        worked_minutes: 480,
        worker_id: scenario1.worker.id,
      });
    });

    it("should be possible to register one clockin in a middle of the day", async () => {
      const clockedDate = await createWorkerRegisterDay(
        scenario1.worker.id,
        1,
        ["10:30", "15:00", "16:30", "17:00", "20:00"],
      );

      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        workerId: scenario1.worker.id,
        registers: [
          {
            clockedAt: new Date(clockedDate.setUTCHours(14, 0, 0, 0)),
          },
        ],
        expectedStatusCode: 201,
      });

      expect(data.message).toStrictEqual("1 novos registros criados");

      const createdRegister = await prisma.clockin.findMany({
        where: {
          worker_id: scenario1.worker.id,
          clocked_at: {
            gte: dateUtils.getStartOfDay(clockedDate),
            lte: dateUtils.getEndOfDay(clockedDate),
          },
        },
        orderBy: {
          clocked_at: "asc",
        },
      });

      const summaryDay = await prisma.workDaySummary.findUnique({
        where: {
          worker_id_work_date: {
            worker_id: scenario1.worker.id,
            work_date: dateUtils.getStartOfDay(clockedDate),
          },
        },
      });

      expect(summaryDay).toStrictEqual({
        expected_minutes: 480,
        id: expect.any(String),
        is_medical_leave: false,
        rested_minutes: 90,
        status: "present",
        time_balance: 0,
        work_date: dateUtils.getStartOfDay(clockedDate),
        worked_minutes: 480,
        worker_id: scenario1.worker.id,
      });
      const expectedRegisters = [
        { isEntry: true, hour: 10, minute: 30 },
        { isEntry: false, hour: 14, minute: 0 },
        { isEntry: true, hour: 15, minute: 0 },
        { isEntry: false, hour: 16, minute: 30 },
        { isEntry: true, hour: 17, minute: 0 },
        { isEntry: false, hour: 20, minute: 0 },
      ];
      expectedRegisters.forEach((time, index) => {
        expect(createdRegister[index]).toStrictEqual({
          id: expect.any(String),
          clocked_at: expect.any(Date),
          is_entry: time.isEntry,
          lat: index == 1 ? -23.55052 : 0,
          lng: index == 1 ? -46.633308 : 0,
          worker_id: scenario1.worker.id,
          registered_by:
            index == 1 ? scenario1.manager.id : scenario1.worker.id,
        });
        expect(createdRegister[index].clocked_at.getUTCHours()).toStrictEqual(
          time.hour,
        );
        expect(createdRegister[index].clocked_at.getUTCMinutes()).toStrictEqual(
          time.minute,
        );
      });
    });
  });

  describe("Authenticated author", () => {
    it("should return error id invalid worker id is provided", async () => {
      const { data } = await expectations({
        workerId: "invalidId",
        cookie: scenario1.author.cookies,
        expectedStatusCode: 404,
        registers: [],
      });
      expect(data).toStrictEqual({
        action: "Verifique o ID informado",
        message: "Funcionário não encontrado",
      });
    });

    it("should return error id worker id is not provided", async () => {
      const { data } = await expectations({
        workerId: "",
        cookie: scenario1.author.cookies,
        expectedStatusCode: 404,
        registers: [],
      });

      expect(data).toStrictEqual({
        action: "Verifique o ID informado",
        message: "Funcionário não encontrado",
      });
    });

    it("should return if autor try to set clockin to worker from another establishment", async () => {
      await expectations({
        workerId: scenario2.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 403,
        registers: [],
      });
    });

    it("should return if more than 10 days registers is provided", async () => {
      const registers = [];

      const date = new Date();
      for (let index = 0; index < 11; index++) {
        const clockedAt = new Date(date);
        clockedAt.setDate(clockedAt.getDate() + index);
        registers.push({ clockedAt });
      }
      const { data } = await expectations({
        workerId: scenario1.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 400,
        registers,
      });

      expect(data).toStrictEqual({
        message: "O máximo de registros para alteração são 10 dias",
        action: "Reduza o número de dias para registro",
      });
    });

    it("should return if invalid date is provided in register", async () => {
      const { data } = await expectations({
        workerId: scenario1.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 400,
        registers: [{ clockedAt: "2025-12-02" }],
      });
      expect(data).toStrictEqual({
        message: `O registro ${1} deve possuir um horário`,
        action: `Verifique o registro: ${1}`,
      });

      const { data: data2 } = await expectations({
        workerId: scenario1.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 400,
        registers: [{ clockedAt: "12T34" }],
      });
      expect(data2).toStrictEqual({
        message: `Data inválida para o registro: 1`,
        action: `Verifique o registro: 1`,
      });
    });

    it("should be possible to register mutiples clockins to a valid worker", async () => {
      const date = getSundayLastMonth(new Date(new Date().setMonth(1)));
      date.setUTCDate(date.getUTCDate() + 1);
      const times = [
        { isEntry: true, hour: 10, minute: 30 },
        { isEntry: false, hour: 14, minute: 0 },
        { isEntry: true, hour: 15, minute: 0 },
        { isEntry: false, hour: 16, minute: 30 },
        { isEntry: true, hour: 17, minute: 0 },
        { isEntry: false, hour: 20, minute: 0 },
      ];

      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        registers: times.map((time) => ({
          clockedAt: new Date(date.setUTCHours(time.hour, time.minute, 0, 0)),
        })),
        expectedStatusCode: 201,
      });

      expect(data.message).toStrictEqual("6 novos registros criados");

      //verificando registros
      const createdRegister = await prisma.clockin.findMany({
        where: {
          worker_id: scenario1.worker.id,
          clocked_at: {
            gte: dateUtils.getStartOfDay(date),
            lte: dateUtils.getEndOfDay(date),
          },
        },
        orderBy: {
          clocked_at: "asc",
        },
      });
      times.forEach((time, index) => {
        expect(createdRegister[index]).toStrictEqual({
          id: expect.any(String),
          clocked_at: expect.any(Date),
          is_entry: time.isEntry,
          lat: -23.55052,
          lng: -46.633308,
          worker_id: scenario1.worker.id,
          registered_by: scenario1.author.id,
        });
        expect(createdRegister[index].clocked_at.getUTCHours()).toStrictEqual(
          time.hour,
        );
        expect(createdRegister[index].clocked_at.getUTCMinutes()).toStrictEqual(
          time.minute,
        );
      });

      //verificando resumos
      const summaryDay = await prisma.workDaySummary.findUnique({
        where: {
          worker_id_work_date: {
            worker_id: scenario1.worker.id,
            work_date: dateUtils.getStartOfDay(date),
          },
        },
      });

      expect(summaryDay).toStrictEqual({
        expected_minutes: 480,
        id: expect.any(String),
        is_medical_leave: false,
        rested_minutes: 90,
        status: "present",
        time_balance: 0,
        work_date: dateUtils.getStartOfDay(date),
        worked_minutes: 480,
        worker_id: scenario1.worker.id,
      });
    });

    it("should be possible to register one clockin in a middle of the day", async () => {
      const clockedDate = await createWorkerRegisterDay(
        scenario1.worker.id,
        2,
        ["10:30", "15:00", "16:30", "17:00", "20:00"],
      );

      const { data } = await expectations({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        registers: [
          {
            clockedAt: new Date(clockedDate.setUTCHours(14, 0, 0, 0)),
          },
        ],
        expectedStatusCode: 201,
      });

      expect(data.message).toStrictEqual("1 novos registros criados");

      const createdRegister = await prisma.clockin.findMany({
        where: {
          worker_id: scenario1.worker.id,
          clocked_at: {
            gte: dateUtils.getStartOfDay(clockedDate),
            lte: dateUtils.getEndOfDay(clockedDate),
          },
        },
        orderBy: {
          clocked_at: "asc",
        },
      });

      const summaryDay = await prisma.workDaySummary.findUnique({
        where: {
          worker_id_work_date: {
            worker_id: scenario1.worker.id,
            work_date: dateUtils.getStartOfDay(clockedDate),
          },
        },
      });

      expect(summaryDay).toStrictEqual({
        expected_minutes: 480,
        id: expect.any(String),
        is_medical_leave: false,
        rested_minutes: 90,
        status: "present",
        time_balance: 0,
        work_date: dateUtils.getStartOfDay(clockedDate),
        worked_minutes: 480,
        worker_id: scenario1.worker.id,
      });
      const expectedRegisters = [
        { isEntry: true, hour: 10, minute: 30 },
        { isEntry: false, hour: 14, minute: 0 },
        { isEntry: true, hour: 15, minute: 0 },
        { isEntry: false, hour: 16, minute: 30 },
        { isEntry: true, hour: 17, minute: 0 },
        { isEntry: false, hour: 20, minute: 0 },
      ];
      expectedRegisters.forEach((time, index) => {
        expect(createdRegister[index]).toStrictEqual({
          id: expect.any(String),
          clocked_at: expect.any(Date),
          is_entry: time.isEntry,
          lat: index == 1 ? -23.55052 : 0,
          lng: index == 1 ? -46.633308 : 0,
          worker_id: scenario1.worker.id,
          registered_by: index == 1 ? scenario1.author.id : scenario1.worker.id,
        });
        expect(createdRegister[index].clocked_at.getUTCHours()).toStrictEqual(
          time.hour,
        );
        expect(createdRegister[index].clocked_at.getUTCMinutes()).toStrictEqual(
          time.minute,
        );
      });
    });
  });
});
