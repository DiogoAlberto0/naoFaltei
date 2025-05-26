import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// models
import { establishmentModel } from "@/src/app/(back)/models/establishment/establishment";
import { workerModel } from "@/src/app/(back)/models/worker/worker";

// errors
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { scheduleModuleV2 } from "@/src/app/(back)/models/scheduleV2/scheduleModuleV2";

// scheme validator

const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
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

    const {
      type,
      month_minutes,
      week_minutes,
      sunday_minutes,
      monday_minutes,
      tuesday_minutes,
      wednesday_minutes,
      thursday_minutes,
      friday_minutes,
      saturday_minutes,
      daysOff,
    } = await request.json();

    if (
      type !== "nothing" &&
      type !== "day" &&
      type !== "week" &&
      type !== "month"
    )
      throw new InputError({
        message: "Tipo de escala inválido",
        action: "Informe uma escala válida: day, week ou month",
      });

    if (daysOff) {
      if (!Array.isArray(daysOff))
        throw new InputError({
          message: "Os dias de folga devem ser um array",
          action: "Informe uma lista de folgas válidas",
        });

      daysOff.forEach((dayOff) => {
        if (!weekDays.includes(dayOff))
          throw new InputError({
            message: "Dias de folgas inválidos",
            action: "Os dias de folga devem ser dias da semana em inglês",
          });
      });
    }

    const createdSchedule = await scheduleModuleV2.createOrUpdate({
      workerId: workerId,
      type,
      month_minutes,
      week_minutes,
      sunday_minutes,
      monday_minutes,
      tuesday_minutes,
      wednesday_minutes,
      thursday_minutes,
      friday_minutes,
      saturday_minutes,
      daysOff: daysOff || [],
    });

    return NextResponse.json(
      {
        createdSchedule,
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
