import { describe, it, expect, beforeAll } from "vitest";

// model
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";

// data tests
import { resetAllDatabase } from "@/prisma/prisma";
import {
  createScenario1,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";

let scenario1: IScenario;

beforeAll(async () => {
  await resetAllDatabase();

  scenario1 = await createScenario1();
});

const listClockinFetch = async ({
  cookie,
}: {
  establishmentId?: string;
  pageSize?: number | string;
  page?: number | string;
  cookie: string;
}) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/clockin/lastTwoRegisters`,
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
  log = false,
}: {
  cookie?: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
  log?: boolean;
}) => {
  const { response, data } = await listClockinFetch({
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

  return {
    data,
  };
};
describe("GET on `/api/v1/clockin/listByEstablishment?establishmentId=[establishmentId]&page=[number]&pageSize=[number]`", () => {
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
    it("should be return empty array if worker dont have clockins", async () => {
      const { data } = await expectations({
        cookie: scenario1.worker.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lastTwoRegisters: [],
      });
    });

    it("should be return last two registers from different days", async () => {
      const baseDate = new Date("2025-04-01T00:00:00Z");

      for (let index = 1; index <= 5; index++) {
        const date = new Date(baseDate);
        date.setUTCDate(index);

        await clockinModel.register({
          clocked_at: date,
          lat: 0,
          lng: 0,
          workerId: scenario1.worker.id,
        });
      }
      const { data } = await expectations({
        cookie: scenario1.worker.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lastTwoRegisters: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            clocked_at: expect.any(String),
            is_entry: expect.any(Boolean),
            lat: 0,
            lng: 0,
            is_auto_generated: false,
            registered_by: scenario1.worker.id,
            worker_id: scenario1.worker.id,
          }),
        ]),
      });
      expect(data.lastTwoRegisters.length).toStrictEqual(2);

      const firstRegister = data.lastTwoRegisters[0];
      const firstRegisterDate = new Date(firstRegister.clocked_at);
      expect(firstRegisterDate.getUTCDate()).toStrictEqual(5);
      expect(firstRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(firstRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );

      const secondRegister = data.lastTwoRegisters[1];
      const secondRegisterDate = new Date(secondRegister.clocked_at);
      expect(secondRegisterDate.getUTCDate()).toStrictEqual(4);
      expect(secondRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(secondRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );
    });

    it("should be return last two registers from the same day", async () => {
      const baseDate = new Date("2025-05-01T00:00:00Z");

      const registers: { clockedAt: Date; isEntry: boolean }[] = [];

      for (let index = 0; index <= 5; index++) {
        const date = new Date(baseDate);
        date.setUTCHours(index);

        registers.push({ clockedAt: date, isEntry: index % 2 == 0 });
      }
      await clockinModel.managerRegister({
        workerId: scenario1.worker.id,
        registers,
        establishmentCoords: { lat: 0, lng: 0 },
        managerId: scenario1.manager.id,
      });

      const { data } = await expectations({
        cookie: scenario1.worker.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lastTwoRegisters: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            clocked_at: expect.any(String),
            is_entry: expect.any(Boolean),
            lat: 0,
            lng: 0,
            is_auto_generated: false,
            registered_by: scenario1.manager.id,
            worker_id: scenario1.worker.id,
          }),
        ]),
      });
      expect(data.lastTwoRegisters.length).toStrictEqual(2);

      const firstRegister = data.lastTwoRegisters[0];
      const firstRegisterDate = new Date(firstRegister.clocked_at);
      expect(firstRegisterDate.getUTCHours()).toStrictEqual(5);
      expect(firstRegisterDate.getUTCDate()).toStrictEqual(
        baseDate.getUTCDate(),
      );
      expect(firstRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(firstRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );

      const secondRegister = data.lastTwoRegisters[1];
      const secondRegisterDate = new Date(secondRegister.clocked_at);
      expect(secondRegisterDate.getUTCHours()).toStrictEqual(4);
      expect(secondRegisterDate.getUTCDate()).toStrictEqual(
        baseDate.getUTCDate(),
      );
      expect(secondRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(secondRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );
    });
  });

  describe("Authenticated manager", () => {
    it("should be return empty array if manager dont have clockins", async () => {
      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lastTwoRegisters: [],
      });
    });

    it("should be return last two registers from different days", async () => {
      const baseDate = new Date("2025-04-01T00:00:00Z");

      for (let index = 1; index <= 5; index++) {
        const date = new Date(baseDate);
        date.setUTCDate(index);

        await clockinModel.register({
          clocked_at: date,
          lat: 0,
          lng: 0,
          workerId: scenario1.manager.id,
        });
      }
      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lastTwoRegisters: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            clocked_at: expect.any(String),
            is_entry: expect.any(Boolean),
            lat: 0,
            lng: 0,
            is_auto_generated: false,
            registered_by: scenario1.manager.id,
            worker_id: scenario1.manager.id,
          }),
        ]),
      });
      expect(data.lastTwoRegisters.length).toStrictEqual(2);

      const firstRegister = data.lastTwoRegisters[0];
      const firstRegisterDate = new Date(firstRegister.clocked_at);
      expect(firstRegisterDate.getUTCDate()).toStrictEqual(5);
      expect(firstRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(firstRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );

      const secondRegister = data.lastTwoRegisters[1];
      const secondRegisterDate = new Date(secondRegister.clocked_at);
      expect(secondRegisterDate.getUTCDate()).toStrictEqual(4);
      expect(secondRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(secondRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );
    });

    it("should be return last two registers from the same day", async () => {
      const baseDate = new Date("2025-05-01T00:00:00Z");

      const registers: { clockedAt: Date; isEntry: boolean }[] = [];

      for (let index = 1; index <= 5; index++) {
        const date = new Date(baseDate);
        date.setUTCHours(index);

        registers.push({ clockedAt: date, isEntry: index % 2 != 0 });
      }
      await clockinModel.managerRegister({
        managerId: scenario1.manager.id,
        registers,
        establishmentCoords: { lat: 0, lng: 0 },
        workerId: scenario1.manager.id,
      });

      const { data } = await expectations({
        cookie: scenario1.manager.cookie,
        expectedStatusCode: 200,
      });

      expect(data).toStrictEqual({
        lastTwoRegisters: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            clocked_at: expect.any(String),
            is_entry: expect.any(Boolean),
            lat: 0,
            lng: 0,
            is_auto_generated: false,
            registered_by: scenario1.manager.id,
            worker_id: scenario1.manager.id,
          }),
        ]),
      });
      expect(data.lastTwoRegisters.length).toStrictEqual(2);

      const firstRegister = data.lastTwoRegisters[0];
      const firstRegisterDate = new Date(firstRegister.clocked_at);
      expect(firstRegisterDate.getUTCHours()).toStrictEqual(5);
      expect(firstRegisterDate.getUTCDate()).toStrictEqual(
        baseDate.getUTCDate(),
      );
      expect(firstRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(firstRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );

      const secondRegister = data.lastTwoRegisters[1];
      const secondRegisterDate = new Date(secondRegister.clocked_at);
      expect(secondRegisterDate.getUTCHours()).toStrictEqual(4);
      expect(secondRegisterDate.getUTCDate()).toStrictEqual(
        baseDate.getUTCDate(),
      );
      expect(secondRegisterDate.getUTCMonth()).toStrictEqual(
        baseDate.getUTCMonth(),
      );
      expect(secondRegisterDate.getUTCFullYear()).toStrictEqual(
        baseDate.getUTCFullYear(),
      );
    });
  });
});
