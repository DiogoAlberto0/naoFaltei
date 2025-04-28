import { describe, it, expect, beforeAll } from "vitest";

import { resetAllDatabase } from "@/prisma/prisma";
import {
  createScenario1,
  createScenario2,
  createWorkerRegisterDay,
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

const listClockinFetch = async ({
  workerId,
  cookie,
  page,
  pageSize,
  inicialDate,
  finalDate,
}: {
  page?: any;
  pageSize?: any;
  inicialDate?: any;
  finalDate?: any;
  workerId: string;
  cookie: string;
}) => {
  const pageQuery = page ? `page=${page}&` : "";
  const pageSizeQuery = pageSize ? `pageSize=${pageSize}&` : "";
  const inicialDateQuery = inicialDate ? `inicialDate=${inicialDate}&` : "";
  const finalDateQuery = finalDate ? `finalDate=${finalDate}&` : "";
  const response = await fetch(
    `http://localhost:3000/api/v1/clockin/timeSheet/${workerId}?` +
      pageQuery +
      pageSizeQuery +
      inicialDateQuery +
      finalDateQuery,
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
  workerId = "",
  cookie = "",
  finalDate = dateUtils.formatToYMD(new Date()),
  inicialDate = dateUtils.formatToYMD(new Date()),
  page = 1,
  pageSize = 10,
  expectedStatusCode = 200,
}: {
  page?: any;
  pageSize?: any;
  inicialDate?: any;
  finalDate?: any;
  workerId?: string;
  cookie?: string;
  expectedStatusCode?: number;
}) => {
  const { response, data } = await listClockinFetch({
    workerId,
    cookie,
    finalDate,
    inicialDate,
    page,
    pageSize,
  });
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

  return { response, data };
};

const expectRegisterDate = (
  dateStr: string,
  expected: {
    day: number;
    month: number;
    year: number;
    hour?: number;
    minute?: number;
  },
) => {
  const date = new Date(dateStr);
  expect(date.getUTCDate()).toStrictEqual(expected.day);
  expect(date.getUTCMonth()).toStrictEqual(expected.month);
  expect(date.getUTCFullYear()).toStrictEqual(expected.year);
  if (expected.hour) expect(date.getUTCHours()).toStrictEqual(expected.hour);
  if (expected.minute)
    expect(date.getUTCMinutes()).toStrictEqual(expected.minute);
};

const expectSummary = (
  timeSheet: any,
  expected: {
    weekDay: number;
    status: string;
    expectedMinutes?: number;
    workedMinutes?: number;
    restedMinutes?: number;
    timeBalance?: number;
    isMedicalLeave?: boolean;
  },
) => {
  const workDate = new Date(timeSheet.work_date);
  expect(workDate).not.toBeNaN();
  expect(workDate.getUTCDay()).toStrictEqual(expected.weekDay);
  expect(timeSheet.status).toStrictEqual(expected.status);
  expect(timeSheet.expected_minutes).toStrictEqual(
    expected.expectedMinutes || 0,
  );
  expect(timeSheet.worked_minutes).toStrictEqual(expected.workedMinutes || 0);
  expect(timeSheet.rested_minutes).toStrictEqual(expected.restedMinutes || 0);
  expect(timeSheet.time_balance).toStrictEqual(expected.timeBalance || 0);
  expect(timeSheet.is_medical_leave).toStrictEqual(
    expected.isMedicalLeave || false,
  );
};
describe("GET on `/api/v1/clockin/timeSheet/:workerId`", () => {
  describe("Anonymous user", () => {
    it("should be return error if cookie is not provided", async () => {
      await expectations({
        workerId: scenario1.worker.id,
        cookie: "",
        expectedStatusCode: 401,
      });
    });

    it("should be return error if cookie is not provided", async () => {
      await expectations({
        workerId: scenario1.worker.id,
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
        expectedStatusCode: 401,
      });
    });
  });

  describe("Authenticated worker", () => {
    it("should be return error if worker try to get clockin from another worker", async () => {
      await expectations({
        workerId: scenario2.manager.id,
        cookie: scenario1.worker.cookie,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated manager", () => {
    it("should be return error if manager try to get clockin from worker from another establishment", async () => {
      await expectations({
        workerId: scenario2.worker.id,
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 403,
      });
    });
  });

  describe("Authenticated author", () => {
    it("should be return error if author try to get clockin from worker from another establishment", async () => {
      await expectations({
        workerId: scenario2.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 403,
      });
    });

    it("should be return error if tring to get timesheet from date before creation date", async () => {
      const baseDate = new Date();

      baseDate.setUTCFullYear(baseDate.getUTCFullYear() - 1);
      const inicialDate = dateUtils.formatToYMD(baseDate);

      baseDate.setUTCMonth(baseDate.getUTCMonth() + 1);
      const finalDate = dateUtils.formatToYMD(baseDate);

      const { data } = await expectations({
        workerId: scenario1.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 400,
        inicialDate,
        finalDate,
      });

      expect(data).toStrictEqual({
        action: "Informe uma data inicial após a data de criação do usuário",
        message:
          "A data inicial não pode ser anterior a data de criação do funcionário",
      });
    });

    it("should be return error if tring to get timesheet from date before creation date", async () => {
      const baseDate = new Date();

      const inicialDate = dateUtils.formatToYMD(baseDate);

      baseDate.setUTCMonth(baseDate.getUTCMonth() + 1);
      const finalDate = dateUtils.formatToYMD(baseDate);

      const { data } = await expectations({
        workerId: scenario1.worker.id,
        cookie: scenario1.author.cookies,
        expectedStatusCode: 400,
        inicialDate,
        finalDate,
      });

      expect(data).toStrictEqual({
        action: "Informe uma data final anterior a data atual",
        message: "A data final não pode ser após a data atual",
      });
    });

    it("should be return timeSheet from worker from your establishment", async () => {
      const date = await createWorkerRegisterDay(scenario1.worker.id, 1, [
        "10:30",
        "14:00",
        "15:00",
        "16:00",
        "16:30",
        "20:00",
      ]);

      await createWorkerRegisterDay(scenario1.worker.id, 2, [
        "10:45",
        "14:00",
        "15:00",
        "16:00",
        "16:30",
        "20:00",
      ]);

      const inicialDate = new Date(date);
      inicialDate.setUTCDate(inicialDate.getUTCDate() - 1);
      const finalDate = new Date(date);
      finalDate.setUTCDate(finalDate.getUTCDate() + 2);

      const { data } = await expectations({
        workerId: scenario1.worker.id,
        cookie: scenario1.author.cookies,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
        expectedStatusCode: 200,
      });

      const timeSheet = data.timeSheet;
      //verificando domingo

      expectSummary(timeSheet[0], {
        weekDay: 0,
        status: "break",
      });
      //verificando segunda

      const monday = timeSheet[1];
      expectSummary(monday, {
        weekDay: 1,
        status: "present",
        expectedMinutes: 480,
        restedMinutes: 90,
        workedMinutes: 480,
      });

      const mondayRegisters = monday.registers;
      expectRegisterDate(monday.work_date, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      });

      expect(mondayRegisters[0].is_entry).toStrictEqual(true);
      expectRegisterDate(mondayRegisters[0].clocked_at, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        hour: 10,
        minute: 30,
      });

      expect(mondayRegisters[1].is_entry).toStrictEqual(false);
      expectRegisterDate(mondayRegisters[1].clocked_at, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        hour: 14,
        minute: 0,
      });

      expect(mondayRegisters[2].is_entry).toStrictEqual(true);
      expectRegisterDate(mondayRegisters[2].clocked_at, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        hour: 15,
        minute: 0,
      });

      expect(mondayRegisters[3].is_entry).toStrictEqual(false);
      expectRegisterDate(mondayRegisters[3].clocked_at, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        hour: 16,
        minute: 0,
      });

      expect(mondayRegisters[4].is_entry).toStrictEqual(true);
      expectRegisterDate(mondayRegisters[4].clocked_at, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        hour: 16,
        minute: 30,
      });

      expect(mondayRegisters[5].is_entry).toStrictEqual(false);
      expectRegisterDate(mondayRegisters[5].clocked_at, {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        hour: 20,
        minute: 0,
      });

      //verificando terça
      const tuesday = timeSheet[2];
      expectSummary(tuesday, {
        weekDay: 2,
        status: "present",
        expectedMinutes: 480,
        restedMinutes: 90,
        workedMinutes: 465,
        timeBalance: -15,
      });
      //vefificando quarta
      const wednesday = timeSheet[timeSheet.length - 1];
      expectSummary(wednesday, {
        weekDay: 3,
        status: "abscent",
        expectedMinutes: 480,
        timeBalance: -480,
      });

      expect(data).toStrictEqual({
        timeSheet: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            work_date: expect.any(String),
            expected_minutes: expect.any(Number),
            worked_minutes: expect.any(Number),
            rested_minutes: expect.any(Number),
            time_balance: expect.any(Number),
            is_medical_leave: expect.any(Boolean),
            status: expect.any(String),
            worker_id: scenario1.worker.id,
            registers: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                clocked_at: expect.any(String),
                is_entry: expect.any(Boolean),
                lat: expect.any(Number),
                lng: expect.any(Number),
                worker_id: scenario1.worker.id,
                registered_by: expect.any(String),
              }),
            ]),
          }),
        ]),
        totalAbscent: 1,
        totalMedicalLeave: 0,
        totalTimeBalance: -495,
      });
    });
  });
});
