import { describe, expect, it, beforeEach } from "vitest";

// scenarios
import {
  createScenario1,
  createScenario2,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";
import { resetAllDatabase } from "@/prisma/prisma";

//model

let scenario1: IScenario;
let scenario2: IScenario;

beforeEach(async () => {
  await resetAllDatabase();
  scenario1 = await createScenario1();
  scenario2 = await createScenario2();
});

const createScheduleFetch = async (
  cookie: string,
  workerId: string,
  body: any,
) => {
  const response = await fetch(
    `http://localhost:3000/api/v2/worker/${workerId}/createWorkerSchedule`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookie
        ? {
            cookie,
          }
        : {},
    },
  );

  const data = await response.json();

  return { response, data };
};

describe("PUT on /api/v1/worker/:id/createWorkerSchedule", () => {
  describe("Anonymous user", () => {
    it("should be return unauthorized message", async () => {
      const { response, data } = await createScheduleFetch(
        "",
        scenario1.worker.id,
        {},
      );

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("Auhtrnticated worker", () => {
    it("should be return unauthorized message", async () => {
      const { response, data } = await createScheduleFetch(
        scenario1.worker.cookie,
        scenario1.worker.id,
        {},
      );

      expect(response.status).toStrictEqual(403);
      expect(data).toStrictEqual({
        message: "Usuário não tem permissão para fazer essa operação.",
        action: "Contate o suporte.",
      });
    });
  });

  describe("Auhtrnticated manager", () => {
    it("should be return unauthorized message if manager is from another establishment", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        scenario1.worker.id,
        {},
      );

      expect(response.status).toStrictEqual(403);
      expect(data).toStrictEqual({
        message: "Usuário não tem permissão para fazer essa operação.",
        action: "Contate o suporte.",
      });
    });

    it("should be return not found worker message if invalid worker id is provided", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        "invalidWorkerId",
        {},
      );

      expect(response.status).toStrictEqual(404);
      expect(data).toStrictEqual({
        action: "Verifique o ID informado",
        message: "Funcionário não encontrado",
      });
    });

    it("should be return input error if type is not provided", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        scenario2.worker.id,
        {},
      );

      expect(response.status).toStrictEqual(400);
      expect(data).toStrictEqual({
        action: "Informe uma escala válida: day, week ou month",
        message: "Tipo de escala inválido",
      });
    });

    it("should be return input error if invalid type is provided", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        scenario2.worker.id,
        {
          type: "invalidType",
        },
      );

      expect(response.status).toStrictEqual(400);
      expect(data).toStrictEqual({
        action: "Informe uma escala válida: day, week ou month",
        message: "Tipo de escala inválido",
      });
    });

    it("should be return input error if provided type is day, but isnt informed days times", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        scenario2.worker.id,
        {
          type: "day",
        },
      );

      expect(response.status).toStrictEqual(400);
      expect(data).toStrictEqual({
        action:
          "Verifique se o tempo de trabalho de todos os dias foram informados",
        message: "Escala para dias inválida",
      });
    });

    it("should be return input error if provided type is week, but isnt informed weeks times", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        scenario2.worker.id,
        {
          type: "week",
        },
      );

      expect(response.status).toStrictEqual(400);
      expect(data).toStrictEqual({
        action:
          "Verifique se o tempo de trabalho por semana foi informado e é um numero",
        message: "Escala para horas semanais inválida",
      });
    });

    it("should be return input error if provided type is month, but isnt informed months times", async () => {
      const { response, data } = await createScheduleFetch(
        scenario2.manager.cookie,
        scenario2.worker.id,
        {
          type: "month",
        },
      );

      expect(response.status).toStrictEqual(400);
      expect(data).toStrictEqual({
        action:
          "Verifique se o tempo de trabalho por mês foi informado e é um numero",
        message: "Escala para horas mensais inválida",
      });
    });

    describe("succefull cases", () => {
      it("should be possible to create and update day schedule", async () => {
        let createdDaySchedule: string;
        //create
        const { response, data } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "day",
            sunday_minutes: 0,
            monday_minutes: 480,
            tuesday_minutes: 480,
            wednesday_minutes: 480,
            thursday_minutes: 480,
            friday_minutes: 480,
            saturday_minutes: 240,
          },
        );

        createdDaySchedule = data.createdSchedule.id;
        expect(response.status).toStrictEqual(201);
        expect(data).toStrictEqual({
          createdSchedule: {
            id: expect.any(String),
            type: "day",
            month_minutes: null,
            week_minutes: null,
            sunday_minutes: 0,
            monday_minutes: 480,
            tuesday_minutes: 480,
            wednesday_minutes: 480,
            thursday_minutes: 480,
            friday_minutes: 480,
            saturday_minutes: 240,
            daysOff: [],
            worker_id: scenario2.worker.id,
          },
        });

        // update
        const { response: response2, data: data2 } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "day",
            sunday_minutes: 0,
            monday_minutes: 480,
            tuesday_minutes: 480,
            wednesday_minutes: 480,
            thursday_minutes: 480,
            friday_minutes: 480,
            saturday_minutes: 0,
          },
        );

        createdDaySchedule = data.createdSchedule.id;
        expect(response2.status).toStrictEqual(201);
        expect(data2).toStrictEqual({
          createdSchedule: {
            id: createdDaySchedule,
            type: "day",
            month_minutes: null,
            week_minutes: null,
            sunday_minutes: 0,
            monday_minutes: 480,
            tuesday_minutes: 480,
            wednesday_minutes: 480,
            thursday_minutes: 480,
            friday_minutes: 480,
            saturday_minutes: 0,
            daysOff: [],
            worker_id: scenario2.worker.id,
          },
        });
      });

      it("should be possible to create and update week schedule", async () => {
        //create
        const { response, data } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "week",
            week_minutes: 2640,
            daysOff: ["sunday"],
          },
        );

        const createdWeekSchedule = data.createdSchedule.id;
        expect(response.status).toStrictEqual(201);
        expect(data).toStrictEqual({
          createdSchedule: {
            id: expect.any(String),
            type: "week",
            month_minutes: null,
            week_minutes: 2640,
            sunday_minutes: null,
            monday_minutes: null,
            tuesday_minutes: null,
            wednesday_minutes: null,
            thursday_minutes: null,
            friday_minutes: null,
            saturday_minutes: null,
            daysOff: ["sunday"],
            worker_id: scenario2.worker.id,
          },
        });

        //update
        const { response: response2, data: data2 } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "week",
            week_minutes: 2000,
          },
        );

        expect(response2.status).toStrictEqual(201);
        expect(data2).toStrictEqual({
          createdSchedule: {
            id: createdWeekSchedule,
            type: "week",
            month_minutes: null,
            week_minutes: 2000,
            sunday_minutes: null,
            monday_minutes: null,
            tuesday_minutes: null,
            wednesday_minutes: null,
            thursday_minutes: null,
            friday_minutes: null,
            saturday_minutes: null,
            daysOff: [],
            worker_id: scenario2.worker.id,
          },
        });
      });

      it("should be possible to create and update month schedule", async () => {
        //create
        const { response, data } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "month",
            month_minutes: 10560,
          },
        );

        const createdMonthSchedule = data.createdSchedule.id;
        expect(response.status).toStrictEqual(201);
        expect(data).toStrictEqual({
          createdSchedule: {
            id: expect.any(String),
            type: "month",
            month_minutes: 10560,
            week_minutes: null,
            sunday_minutes: null,
            monday_minutes: null,
            tuesday_minutes: null,
            wednesday_minutes: null,
            thursday_minutes: null,
            friday_minutes: null,
            saturday_minutes: null,
            daysOff: [],
            worker_id: scenario2.worker.id,
          },
        });

        //update
        const { response: response2, data: data2 } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "month",
            month_minutes: 10000,
          },
        );

        expect(response2.status).toStrictEqual(201);
        expect(data2).toStrictEqual({
          createdSchedule: {
            id: createdMonthSchedule,
            type: "month",
            month_minutes: 10000,
            week_minutes: null,
            sunday_minutes: null,
            monday_minutes: null,
            tuesday_minutes: null,
            wednesday_minutes: null,
            thursday_minutes: null,
            friday_minutes: null,
            saturday_minutes: null,
            daysOff: [],
            worker_id: scenario2.worker.id,
          },
        });
      });

      it("should be possible to update from month to week type", async () => {
        //create
        const { response: createdResponse, data: createdData } =
          await createScheduleFetch(
            scenario2.manager.cookie,
            scenario2.worker.id,
            {
              type: "month",
              month_minutes: 10560,
            },
          );
        expect(createdResponse.status).toStrictEqual(201);
        const createdMonthSchedule = createdData.createdSchedule.id;

        //update
        const { response, data } = await createScheduleFetch(
          scenario2.manager.cookie,
          scenario2.worker.id,
          {
            type: "week",
            week_minutes: 1056,
          },
        );

        expect(response.status).toStrictEqual(201);
        expect(data).toStrictEqual({
          createdSchedule: {
            id: createdMonthSchedule,
            type: "week",
            month_minutes: null,
            week_minutes: 1056,
            sunday_minutes: null,
            monday_minutes: null,
            tuesday_minutes: null,
            wednesday_minutes: null,
            thursday_minutes: null,
            friday_minutes: null,
            saturday_minutes: null,
            daysOff: [],
            worker_id: scenario2.worker.id,
          },
        });
      });

      it("should be possible to update from week to day type", async () => {
        //   //create
        //   const { response: createdResponse, data: createdData } =
        //     await createScheduleFetch(
        //       scenario2.manager.cookie,
        //       scenario2.worker.id,
        //       {
        //         type: "week",
        //         week_minutes: 1056,
        //       },
        //     );
        //   expect(createdResponse.status).toStrictEqual(201);
        //   const createdMonthSchedule = createdData.createdSchedule.id;
        //   //update
        //   const { response, data } = await createScheduleFetch(
        //     scenario2.manager.cookie,
        //     scenario2.worker.id,
        //     {
        //       type: "day",
        //       sunday_minutes: 480,
        //       monday_minutes: 480,
        //       tuesday_minutes: 480,
        //       wednesday_minutes: 480,
        //       thursday_minutes: 480,
        //       friday_minutes: 480,
        //       saturday_minutes: 480,
        //     },
        //   );
        //   expect(response.status).toStrictEqual(201);
        //   expect(data).toStrictEqual({
        //     createdSchedule: {
        //       id: createdMonthSchedule,
        //       type: "day",
        //       month_minutes: null,
        //       week_minutes: null,
        //       sunday_minutes: 480,
        //       monday_minutes: 480,
        //       tuesday_minutes: 480,
        //       wednesday_minutes: 480,
        //       thursday_minutes: 480,
        //       friday_minutes: 480,
        //       saturday_minutes: 480,
        //       daysOff: [],
        //       worker_id: scenario2.worker.id,
        //     },
        //   });
        // });
      });
    });
  });
});
