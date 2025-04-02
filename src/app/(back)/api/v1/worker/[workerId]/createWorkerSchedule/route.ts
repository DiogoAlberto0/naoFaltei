import { auth } from "@/auth";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scheduleScheme = z.object({
  schedule: z.record(
    z.enum([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]),
    z
      .object({
        startHour: z.number().min(0).max(23),
        startMinute: z.number().min(0).max(59),
        endHour: z.number().min(0).max(23),
        endMinute: z.number().min(0).max(59),
        restTimeInMinutes: z.number().min(0),
      })
      .nullable(),
  ),
});

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId } = await params;
    const workerToUpdate = await workerModel.findUniqueBy({ id: workerId });
    if (!workerToUpdate)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID informado",
      });

    const isManagerFromEstablishment =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        managerId: session.user.id,
        establishmentId: workerToUpdate.establishment_id,
      });
    if (!isManagerFromEstablishment) throw new ForbiddenError();

    const body = await request.json();

    const result = scheduleScheme.safeParse(body);
    if (!result.success) {
      throw new InputError({
        message: "Formato do corpo da requisição inválido",
        action:
          "Informe o dia da semana em inglês, o horario de entrada e saída (hora e minuto) e o tempo de descanso em minutos",
      });
    }

    const schedule = result.data.schedule;
    await workerModel.deleteSchedule(workerId);
    await workerModel.setSchedule({
      workerId,
      schedule: {
        sunday: schedule.sunday || null,
        monday: schedule.monday || null,
        tuesday: schedule.tuesday || null,
        wednesday: schedule.wednesday || null,
        thursday: schedule.thursday || null,
        friday: schedule.friday || null,
        saturday: schedule.saturday || null,
      },
    });

    const createdSchedule = Object.entries(schedule).map(([weekDay, value]) => [
      weekDay,

      value
        ? { ...value, isDayOff: false }
        : {
            startHour: 0,
            startMinute: 0,
            endHour: 0,
            endMinute: 0,
            restTimeInMinutes: 0,
            isDayOff: true,
          },
    ]);
    return NextResponse.json(
      {
        ...Object.fromEntries(createdSchedule),
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Ocorreu um erro interno",
        action: error.action || "Contate o suporte",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
