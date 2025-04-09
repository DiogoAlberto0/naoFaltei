import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

//models
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";

//Errors
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";

//utils
import { dateUtils } from "@/src/utils/date";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId, ...dates } = await request.json();

    const inicialDate = dateUtils.validateAndReturnDate(dates.inicialDate);
    const finalDate = dateUtils.validateAndReturnDate(dates.finalDate);

    const worker = await workerModel.findUniqueBy({ id: workerId });
    if (!worker)
      throw new NotFoundError({
        message: "Funcionário nâo encontrado",
        action: "Verifique o ID do funcionário",
      });

    const isManagerFromEstablishment =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        establishmentId: worker.establishment_id,
        managerId: session.user.id,
      });
    if (!isManagerFromEstablishment || session.user.id === workerId)
      throw new ForbiddenError();

    await clockinModel.setMedicalLeave(workerId, inicialDate, finalDate);

    return NextResponse.json({
      message: "Atestado cadastrado com sucesso.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Ocorreu um erro inesperado",
        action: error.action || "Contate o suporte",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
