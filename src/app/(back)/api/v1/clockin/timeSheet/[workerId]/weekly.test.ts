import { prisma, resetAllDatabase } from "@/prisma/prisma";
import { workDaySummaryModel } from "@/src/app/(back)/models/workDaySummary/workDaySummary";
import {
  createScenario1,
  IScenario,
} from "@/src/app/(back)/tests/entitysForTest";
import { dateUtils } from "@/src/utils/date";
import { describe, it, expect, beforeAll } from "vitest";

let scenario1: IScenario;

beforeAll(async () => {
  await resetAllDatabase();
  scenario1 = await createScenario1();

  await prisma.workers.update({
    where: {
      id: scenario1.worker.id,
    },
    data: {
      created_at: new Date(Date.UTC(2022, 4, 26)),
    },
  });
  await prisma.workerScheduleV2.create({
    data: {
      worker_id: scenario1.worker.id,
      type: "week",
      week_minutes: 44 * 60,
      daysOff: ["sunday"],
      sunday_minutes: undefined,
      monday_minutes: undefined,
      tuesday_minutes: undefined,
      wednesday_minutes: undefined,
      thursday_minutes: undefined,
      friday_minutes: undefined,
      saturday_minutes: undefined,
    },
  });
});

const getTimeSheet = async ({
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

const registerClockin = async (
  isEntry: boolean,
  {
    date,
    month,
    year = 2025,
    hour,
    minute = 0,
  }: {
    date: number;
    month: number;
    year?: number;
    hour: number;
    minute?: number;
  },
) => {
  const clocked_at = new Date(Date.UTC(year, month, date, hour, minute));

  await prisma.clockin.create({
    data: {
      worker_id: scenario1.worker.id,
      clocked_at,
      lat: 0,
      lng: 0,
      registered_by: scenario1.worker.id,
      is_entry: isEntry,
    },
  });
  await workDaySummaryModel.recalculateSummary(scenario1.worker.id, clocked_at);
};
describe("GET on `/api/v1/timeSheet/:workerId`", () => {
  describe("Daily journey", () => {
    it("should be return 0 totalTimeBalance 0 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2025, 4, 26));
      const finalDate = new Date(Date.UTC(2025, 5, 1));

      //registro segunda, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 26, month: 4, hour: 10 });
      await registerClockin(false, { date: 26, month: 4, hour: 12 });
      await registerClockin(true, { date: 26, month: 4, hour: 13 });
      await registerClockin(false, { date: 26, month: 4, hour: 19 });

      //registro terca, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 27, month: 4, hour: 10 });
      await registerClockin(false, { date: 27, month: 4, hour: 12 });
      await registerClockin(true, { date: 27, month: 4, hour: 13 });
      await registerClockin(false, { date: 27, month: 4, hour: 19 });

      //registro quarta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 28, month: 4, hour: 10 });
      await registerClockin(false, { date: 28, month: 4, hour: 12 });
      await registerClockin(true, { date: 28, month: 4, hour: 13 });
      await registerClockin(false, { date: 28, month: 4, hour: 19 });

      //registro quinta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 29, month: 4, hour: 10 });
      await registerClockin(false, { date: 29, month: 4, hour: 12 });
      await registerClockin(true, { date: 29, month: 4, hour: 13 });
      await registerClockin(false, { date: 29, month: 4, hour: 19 });

      //registro sexta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 30, month: 4, hour: 10 });
      await registerClockin(false, { date: 30, month: 4, hour: 12 });
      await registerClockin(true, { date: 30, month: 4, hour: 13 });
      await registerClockin(false, { date: 30, month: 4, hour: 19 });

      //registros sabado, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 31, month: 4, hour: 8 });
      await registerClockin(false, { date: 31, month: 4, hour: 12 });

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(0);
    });

    it("should be return 0 totalTimeBalance 1 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2025, 4, 19));
      const finalDate = new Date(Date.UTC(2025, 4, 25));

      //registro segunda, ATESTADO
      await prisma.workDaySummary.create({
        data: {
          worker_id: scenario1.worker.id,
          is_medical_leave: true,
          work_date: inicialDate,
          worked_minutes: 480,
        },
      });

      //registro terca, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 20, month: 4, hour: 10 });
      await registerClockin(false, { date: 20, month: 4, hour: 12 });
      await registerClockin(true, { date: 20, month: 4, hour: 13 });
      await registerClockin(false, { date: 20, month: 4, hour: 19 });

      //registro quarta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 21, month: 4, hour: 10 });
      await registerClockin(false, { date: 21, month: 4, hour: 12 });
      await registerClockin(true, { date: 21, month: 4, hour: 13 });
      await registerClockin(false, { date: 21, month: 4, hour: 19 });

      //registro quinta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 22, month: 4, hour: 10 });
      await registerClockin(false, { date: 22, month: 4, hour: 12 });
      await registerClockin(true, { date: 22, month: 4, hour: 13 });
      await registerClockin(false, { date: 22, month: 4, hour: 19 });

      //registro sexta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 23, month: 4, hour: 10 });
      await registerClockin(false, { date: 23, month: 4, hour: 12 });
      await registerClockin(true, { date: 23, month: 4, hour: 13 });
      await registerClockin(false, { date: 23, month: 4, hour: 19 });

      //registros sabado, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 24, month: 4, hour: 8 });
      await registerClockin(false, { date: 24, month: 4, hour: 12 });

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(1);
      expect(data.totalTimeBalance).toStrictEqual(0);
    });

    it("should be return 0 totalTimeBalance 0 medicalLeave and 1 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2025, 4, 12));
      const finalDate = new Date(Date.UTC(2025, 4, 18));

      //registro segunda, FALTA

      //registro terca, 12HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 13, month: 4, hour: 6 });
      await registerClockin(false, { date: 13, month: 4, hour: 12 });
      await registerClockin(true, { date: 13, month: 4, hour: 13 });
      await registerClockin(false, { date: 13, month: 4, hour: 19 });

      //registro quarta, 12HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 14, month: 4, hour: 6 });
      await registerClockin(false, { date: 14, month: 4, hour: 12 });
      await registerClockin(true, { date: 14, month: 4, hour: 13 });
      await registerClockin(false, { date: 14, month: 4, hour: 19 });

      //registro quinta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 15, month: 4, hour: 10 });
      await registerClockin(false, { date: 15, month: 4, hour: 12 });
      await registerClockin(true, { date: 15, month: 4, hour: 13 });
      await registerClockin(false, { date: 15, month: 4, hour: 19 });

      //registro sexta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 16, month: 4, hour: 10 });
      await registerClockin(false, { date: 16, month: 4, hour: 12 });
      await registerClockin(true, { date: 16, month: 4, hour: 13 });
      await registerClockin(false, { date: 16, month: 4, hour: 19 });

      //registros sabado, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 17, month: 4, hour: 8 });
      await registerClockin(false, { date: 17, month: 4, hour: 12 });

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(1);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(0);
    });

    it("should be return -60 totalTimeBalance 0 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2025, 4, 5));
      const finalDate = new Date(Date.UTC(2025, 4, 11));

      //registro segunda, 7HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 5, month: 4, hour: 11 });
      await registerClockin(false, { date: 5, month: 4, hour: 12 });
      await registerClockin(true, { date: 5, month: 4, hour: 13 });
      await registerClockin(false, { date: 5, month: 4, hour: 19 });

      //registro terca, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 6, month: 4, hour: 10 });
      await registerClockin(false, { date: 6, month: 4, hour: 12 });
      await registerClockin(true, { date: 6, month: 4, hour: 13 });
      await registerClockin(false, { date: 6, month: 4, hour: 19 });

      //registro quarta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 7, month: 4, hour: 10 });
      await registerClockin(false, { date: 7, month: 4, hour: 12 });
      await registerClockin(true, { date: 7, month: 4, hour: 13 });
      await registerClockin(false, { date: 7, month: 4, hour: 19 });

      //registro quinta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 8, month: 4, hour: 10 });
      await registerClockin(false, { date: 8, month: 4, hour: 12 });
      await registerClockin(true, { date: 8, month: 4, hour: 13 });
      await registerClockin(false, { date: 8, month: 4, hour: 19 });

      //registro sexta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 9, month: 4, hour: 10 });
      await registerClockin(false, { date: 9, month: 4, hour: 12 });
      await registerClockin(true, { date: 9, month: 4, hour: 13 });
      await registerClockin(false, { date: 9, month: 4, hour: 19 });

      //registros sabado, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 10, month: 4, hour: 8 });
      await registerClockin(false, { date: 10, month: 4, hour: 12 });

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(-60);
    });

    it("should be return 60 totalTimeBalance 0 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2025, 3, 28));
      const finalDate = new Date(Date.UTC(2025, 4, 4));

      //registro segunda, 8:30HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 28, month: 3, hour: 9, minute: 30 });
      await registerClockin(false, { date: 28, month: 3, hour: 12 });
      await registerClockin(true, { date: 28, month: 3, hour: 13 });
      await registerClockin(false, { date: 28, month: 3, hour: 19 });

      //registro terca,  8:30HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 29, month: 3, hour: 9, minute: 30 });
      await registerClockin(false, { date: 29, month: 3, hour: 12 });
      await registerClockin(true, { date: 29, month: 3, hour: 13 });
      await registerClockin(false, { date: 29, month: 3, hour: 19 });

      //registro quarta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 30, month: 3, hour: 10 });
      await registerClockin(false, { date: 30, month: 3, hour: 12 });
      await registerClockin(true, { date: 30, month: 3, hour: 13 });
      await registerClockin(false, { date: 30, month: 3, hour: 19 });

      //registro quinta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 1, month: 4, hour: 10 });
      await registerClockin(false, { date: 1, month: 4, hour: 12 });
      await registerClockin(true, { date: 1, month: 4, hour: 13 });
      await registerClockin(false, { date: 1, month: 4, hour: 19 });

      //registro sexta, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 2, month: 4, hour: 10 });
      await registerClockin(false, { date: 2, month: 4, hour: 12 });
      await registerClockin(true, { date: 2, month: 4, hour: 13 });
      await registerClockin(false, { date: 2, month: 4, hour: 19 });

      //registros sabado, 8HRS trabalhadas 1HR de almoco
      await registerClockin(true, { date: 3, month: 4, hour: 8 });
      await registerClockin(false, { date: 3, month: 4, hour: 12 });

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(60);
    });
  });

  describe("night journey", () => {
    it("should be return 0 totalTimeBalance 0 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2024, 0, 1));
      const finalDate = new Date(Date.UTC(2024, 0, 7));

      const registers = [
        //segunda 8HRS trabalhadas 1HR de almoco
        { date: 31, month: 11, hour: 20, year: 2023 },
        { date: 1, month: 0, year: 2024, hour: 0 },
        { date: 1, month: 0, year: 2024, hour: 1 },
        { date: 1, month: 0, year: 2024, hour: 5 },
        //terca 8HRS trabalhadas 1HR de almoco
        { date: 1, month: 0, hour: 20, year: 2024 },
        { date: 2, month: 0, hour: 1, year: 2024 },
        { date: 2, month: 0, hour: 2, year: 2024 },
        { date: 2, month: 0, hour: 5, year: 2024 },
        //quarta 8HRS trabalhadas 1HR de almoco
        { date: 2, month: 0, hour: 20, year: 2024 },
        { date: 3, month: 0, hour: 0, year: 2024 },
        { date: 3, month: 0, hour: 1, year: 2024 },
        { date: 3, month: 0, hour: 5, year: 2024 },
        //quinta 8HRS trabalhadas 1HR de almoco
        { date: 3, month: 0, hour: 20, year: 2024 },
        { date: 4, month: 0, hour: 0, year: 2024 },
        { date: 4, month: 0, hour: 1, year: 2024 },
        { date: 4, month: 0, hour: 5, year: 2024 },
        //sexta 8HRS trabalhadas 1HR de almoco
        { date: 4, month: 0, hour: 20, year: 2024 },
        { date: 5, month: 0, hour: 0, year: 2024 },
        { date: 5, month: 0, hour: 1, year: 2024 },
        { date: 5, month: 0, hour: 5, year: 2024 },
        //sabado 8HRS trabalhadas 1HR de almoco
        { date: 5, month: 0, hour: 22, year: 2024 },
        { date: 6, month: 0, hour: 2, year: 2024 },
        //registro segunda, 8HRS trabalhadas 1HR de almoco
        { date: 7, month: 0, hour: 20, year: 2024 },
      ];

      for (let index = 0; index < registers.length; index++) {
        const element = registers[index];

        const { date, month, year, hour } = element;
        await registerClockin(index % 2 == 0, {
          date,
          month,
          year,
          hour,
        });
      }

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(0);
    });

    it("should be return 0 totalTimeBalance 1 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2024, 0, 8));
      const finalDate = new Date(Date.UTC(2024, 0, 14));

      //segunda ATESTADO
      await prisma.workDaySummary.create({
        data: {
          worker_id: scenario1.worker.id,
          work_date: inicialDate,
          is_medical_leave: true,
          worked_minutes: 480,
        },
      });
      const registers = [
        //terca 8HRS trabalhadas 1HR de almoco
        { date: 8, month: 0, year: 2024, hour: 20 },
        { date: 9, month: 0, year: 2024, hour: 0 },
        { date: 9, month: 0, year: 2024, hour: 1 },
        { date: 9, month: 0, year: 2024, hour: 5 },
        //quarta 8HRS trabalhadas 1HR de almoco
        { date: 9, month: 0, year: 2024, hour: 20 },
        { date: 10, month: 0, year: 2024, hour: 0 },
        { date: 10, month: 0, year: 2024, hour: 1 },
        { date: 10, month: 0, year: 2024, hour: 5 },
        //quinta 8HRS trabalhadas 1HR de almoco
        { date: 10, month: 0, year: 2024, hour: 20 },
        { date: 11, month: 0, year: 2024, hour: 0 },
        { date: 11, month: 0, year: 2024, hour: 1 },
        { date: 11, month: 0, year: 2024, hour: 5 },
        //sexta 8HRS trabalhadas 1HR de almoco
        { date: 11, month: 0, year: 2024, hour: 20 },
        { date: 12, month: 0, year: 2024, hour: 0 },
        { date: 12, month: 0, year: 2024, hour: 1 },
        { date: 12, month: 0, year: 2024, hour: 5 },
        //sabado 8HRS trabalhadas 1HR de almoco
        { date: 12, month: 0, year: 2024, hour: 22 },
        { date: 13, month: 0, year: 2024, hour: 2 },
      ];

      for (let index = 0; index < registers.length; index++) {
        const element = registers[index];

        const { date, month, year, hour } = element;
        await registerClockin(index % 2 == 0, {
          date,
          month,
          year,
          hour,
        });
      }

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(1);
      expect(data.totalTimeBalance).toStrictEqual(0);
    });

    it("should be return 0 totalTimeBalance 0 medicalLeave and 1 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2024, 0, 15));
      const finalDate = new Date(Date.UTC(2024, 0, 21));

      const registers = [
        // segunda FALTA

        //terca 12HRS trabalhadas 1HR de almoco
        { date: 14, month: 0, year: 2024, hour: 20 },
        { date: 15, month: 0, year: 2024, hour: 0 },
        { date: 15, month: 0, year: 2024, hour: 1 },
        { date: 15, month: 0, year: 2024, hour: 9 },
        //quarta 12HRS trabalhadas 1HR de almoco
        { date: 15, month: 0, year: 2024, hour: 20 },
        { date: 16, month: 0, year: 2024, hour: 0 },
        { date: 16, month: 0, year: 2024, hour: 1 },
        { date: 16, month: 0, year: 2024, hour: 9 },
        //quinta 8HRS trabalhadas 1HR de almoco
        { date: 16, month: 0, year: 2024, hour: 20 },
        { date: 17, month: 0, year: 2024, hour: 0 },
        { date: 17, month: 0, year: 2024, hour: 1 },
        { date: 17, month: 0, year: 2024, hour: 5 },
        //sexta 8HRS trabalhadas 1HR de almoco
        { date: 17, month: 0, year: 2024, hour: 20 },
        { date: 18, month: 0, year: 2024, hour: 0 },
        { date: 18, month: 0, year: 2024, hour: 1 },
        { date: 18, month: 0, year: 2024, hour: 5 },
        //sabado 8HRS trabalhadas 1HR de almoco
        { date: 18, month: 0, year: 2024, hour: 22 },
        { date: 19, month: 0, year: 2024, hour: 2 },

        //segunda
        { date: 21, month: 0, year: 2024, hour: 20 },
      ];

      for (let index = 0; index < registers.length; index++) {
        const element = registers[index];

        const { date, month, year, hour } = element;
        await registerClockin(index % 2 == 0, {
          date,
          month,
          year,
          hour,
        });
      }

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(1);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(0);
    });

    it("should be return -60 totalTimeBalance 0 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2024, 0, 22));
      const finalDate = new Date(Date.UTC(2024, 0, 28));

      const registers = [
        // segunda 8HRS trabalhadas 1HR de almoco
        { date: 21, month: 0, year: 2024, hour: 20 },
        { date: 22, month: 0, year: 2024, hour: 0 },
        { date: 22, month: 0, year: 2024, hour: 1 },
        { date: 22, month: 0, year: 2024, hour: 5 },
        //terca 8HRS trabalhadas 1HR de almoco
        { date: 22, month: 0, year: 2024, hour: 20, minute: 30 },
        { date: 23, month: 0, year: 2024, hour: 0 },
        { date: 23, month: 0, year: 2024, hour: 1 },
        { date: 23, month: 0, year: 2024, hour: 5 },
        //quarta 8HRS trabalhadas 1HR de almoco
        { date: 23, month: 0, year: 2024, hour: 20, minute: 30 },
        { date: 24, month: 0, year: 2024, hour: 0 },
        { date: 24, month: 0, year: 2024, hour: 1 },
        { date: 24, month: 0, year: 2024, hour: 5 },
        //quinta 8HRS trabalhadas 1HR de almoco
        { date: 24, month: 0, year: 2024, hour: 20 },
        { date: 25, month: 0, year: 2024, hour: 0 },
        { date: 25, month: 0, year: 2024, hour: 1 },
        { date: 25, month: 0, year: 2024, hour: 5 },
        //sexta 8HRS trabalhadas 1HR de almoco
        { date: 25, month: 0, year: 2024, hour: 20 },
        { date: 26, month: 0, year: 2024, hour: 0 },
        { date: 26, month: 0, year: 2024, hour: 1 },
        { date: 26, month: 0, year: 2024, hour: 5 },
        //sabado 8HRS trabalhadas 1HR de almoco
        { date: 26, month: 0, year: 2024, hour: 22 },
        { date: 27, month: 0, year: 2024, hour: 2 },

        //segunda
        { date: 28, month: 0, year: 2024, hour: 20 },
      ];

      for (let index = 0; index < registers.length; index++) {
        const element = registers[index];

        const { date, month, year, hour, minute } = element;
        await registerClockin(index % 2 == 0, {
          date,
          month,
          year,
          hour,
          minute,
        });
      }

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(-60);
    });

    it("should be return 60 totalTimeBalance 0 medicalLeave and 0 totalAbscent", async () => {
      const inicialDate = new Date(Date.UTC(2024, 0, 29));
      const finalDate = new Date(Date.UTC(2024, 1, 4));

      const registers = [
        // segunda 8HRS trabalhadas 1HR de almoco
        { date: 28, month: 0, year: 2024, hour: 20 },
        { date: 29, month: 0, year: 2024, hour: 0 },
        { date: 29, month: 0, year: 2024, hour: 1 },
        { date: 29, month: 0, year: 2024, hour: 5 },
        //terca 8HRS trabalhadas 1HR de almoco
        { date: 29, month: 0, year: 2024, hour: 19, minute: 30 },
        { date: 30, month: 0, year: 2024, hour: 0 },
        { date: 30, month: 0, year: 2024, hour: 1 },
        { date: 30, month: 0, year: 2024, hour: 5 },
        //quarta 8HRS trabalhadas 1HR de almoco
        { date: 30, month: 0, year: 2024, hour: 19, minute: 30 },
        { date: 31, month: 0, year: 2024, hour: 0 },
        { date: 31, month: 0, year: 2024, hour: 1 },
        { date: 31, month: 0, year: 2024, hour: 5 },
        //quinta 8HRS trabalhadas 1HR de almoco
        { date: 31, month: 0, year: 2024, hour: 20 },
        { date: 1, month: 1, year: 2024, hour: 0 },
        { date: 1, month: 1, year: 2024, hour: 1 },
        { date: 1, month: 1, year: 2024, hour: 5 },
        //sexta 8HRS trabalhadas 1HR de almoco
        { date: 1, month: 1, year: 2024, hour: 20 },
        { date: 2, month: 1, year: 2024, hour: 0 },
        { date: 2, month: 1, year: 2024, hour: 1 },
        { date: 2, month: 1, year: 2024, hour: 5 },
        //sabado 8HRS trabalhadas 1HR de almoco
        { date: 2, month: 1, year: 2024, hour: 22 },
        { date: 3, month: 1, year: 2024, hour: 2 },

        //segunda
        { date: 4, month: 1, year: 2024, hour: 20 },
      ];

      for (let index = 0; index < registers.length; index++) {
        const element = registers[index];

        const { date, month, year, hour, minute } = element;
        await registerClockin(index % 2 == 0, {
          date,
          month,
          year,
          hour,
          minute,
        });
      }

      const { data } = await getTimeSheet({
        cookie: scenario1.author.cookies,
        workerId: scenario1.worker.id,
        inicialDate: dateUtils.formatToYMD(inicialDate),
        finalDate: dateUtils.formatToYMD(finalDate),
      });

      expect(data.totalAbscent).toStrictEqual(0);
      expect(data.totalMedicalLeave).toStrictEqual(0);
      expect(data.totalTimeBalance).toStrictEqual(60);
    });
  });
});
