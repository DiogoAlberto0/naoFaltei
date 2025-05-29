import { prisma } from "@/prisma/prisma";

//utils
import { groupBy } from "lodash";
import { dateUtils } from "@/src/utils/date";

//models
import { clockinGetters } from "./getters";
import { clockinModel, IClockin } from "./clockin";

//errors
import { InputError } from "@/src/Errors/errors";
import { workDaySummaryModel } from "../workDaySummary/workDaySummary";

const register = async ({
  workerId,
  clocked_at,
  lat,
  lng,
}: {
  clocked_at: Date;
  workerId: string;
  lat: number;
  lng: number;
}) => {
  const lastRegister = await clockinGetters.getLastRegisterOfDay(
    workerId,
    clocked_at,
  );
  const isEntry = !lastRegister || !lastRegister.is_entry;

  await prisma.clockin.create({
    data: {
      clocked_at: clocked_at,
      is_entry: isEntry,
      worker: { connect: { id: workerId } },
      registered_by: workerId,
      lat,
      lng,
      is_auto_generated: false,
    },
  });

  await workDaySummaryModel.recalculateSummary(workerId, clocked_at);
};

const setAbscentOrBreak = async (
  workerId: string,
  date: Date,
  expectedMinutes: number[],
) => {
  if (expectedMinutes[date.getUTCDay()] > 0) {
    const newRegiser = await prisma.workDaySummary.create({
      data: {
        worker_id: workerId,
        work_date: date,
        status: "abscent",
        expected_minutes: expectedMinutes[date.getUTCDay()],
        time_balance: -expectedMinutes[date.getUTCDay()],
      },
    });
    return newRegiser;
  } else {
    const newRegiser = await prisma.workDaySummary.create({
      data: {
        worker_id: workerId,
        work_date: date,
        status: "break",
      },
    });
    return newRegiser;
  }
};

const setMedicalLeave = async (
  workerId: string,
  inicialDate: Date,
  finalDate: Date,
) => {
  const datesBetween = dateUtils.getAllDatesInRange(inicialDate, finalDate);

  await Promise.all(
    datesBetween.map(async (date) => {
      const workDate = dateUtils.getStartOfDay(date);
      return prisma.workDaySummary.upsert({
        where: {
          worker_id_work_date: {
            worker_id: workerId,
            work_date: workDate,
          },
        },
        create: {
          is_medical_leave: true,
          work_date: workDate,
          worker_id: workerId,
        },
        update: {
          is_medical_leave: true,
        },
      });
    }),
  );
};

const managerRegister = async ({
  managerId,
  workerId,
  establishmentCoords: { lat, lng },
  registers,
}: {
  managerId: string;
  workerId: string;
  establishmentCoords: {
    lat: number;
    lng: number;
  };
  registers: { clockedAt: Date; isEntry: boolean }[];
}) => {
  const data = registers.map((r) => ({
    registered_by: managerId,
    is_entry: r.isEntry,
    clocked_at: r.clockedAt,
    worker_id: workerId,
    lat,
    lng,
    is_auto_generated: false,
  }));

  const registerGroupByDate = groupBy(data, (r) =>
    dateUtils.formatToYMD(r.clocked_at),
  );

  await Promise.all(
    Object.entries(registerGroupByDate).map(async ([key, registers]) => {
      const date = new Date(key);

      const lastRegisters = await clockinModel.getClockinsByDate(
        workerId,
        date,
      );

      const newRegisters = validateAndSortNewClockins([
        ...lastRegisters,
        ...registers,
      ]);

      await deleteManyClockins(workerId, date);

      await createManyClockins(newRegisters);
    }),
  );

  await Promise.all(
    Object.keys(registerGroupByDate).map(async (key) => {
      const date = new Date(key);
      await workDaySummaryModel.recalculateSummary(workerId, date);
    }),
  );

  return { count: registers.length };
};

const validateAndSortNewClockins = (clockins: IClockin[]) => {
  const sortedClockins = clockins.sort(
    (r1, r2) => r1.clocked_at.getTime() - r2.clocked_at.getTime(),
  );

  sortedClockins.forEach((register, index) => {
    if (index > 0 && clockins[index - 1].is_entry == register.is_entry)
      throw new InputError({
        message: "Os registros devem ser alternados entre entradas e saídas",
        action:
          "Verifique os novos registros e se o funcionário já possui registros nessas datas",
      });
  });
  return sortedClockins;
};

const createManyClockins = async (clockins: IClockin[]) => {
  await prisma.clockin.createMany({
    data: clockins,
    skipDuplicates: true,
  });
};

const deleteManyClockins = async (workerId: string, date: Date) => {
  await prisma.clockin.deleteMany({
    where: {
      worker_id: workerId,
      clocked_at: {
        gte: dateUtils.getStartOfDay(date),
        lte: dateUtils.getEndOfDay(date),
      },
    },
  });
};

export const clockinSetters = {
  register,
  setAbscentOrBreak,
  setMedicalLeave,
  managerRegister,
};
