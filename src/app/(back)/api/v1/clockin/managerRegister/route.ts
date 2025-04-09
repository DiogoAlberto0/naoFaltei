import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

//models
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";

//errors
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId, registers } = await request.json();

    if (!Array.isArray(registers))
      throw new InputError({
        message: "Os registros devem ser um array",
      });

    const registersNormalized = registers.map(({ clockedAt }, index) => {
      const haveTime = clockedAt.split("T").length == 2;

      if (!haveTime)
        throw new InputError({
          message: `O registro ${index + 1} deve possuir um horário`,
          action: `Verifique o registro: ${index + 1}`,
        });
      const date = new Date(clockedAt);
      if (!clockedAt || isNaN(date.getTime()))
        throw new InputError({
          message: `Data inválida para o registro: ${index + 1}`,
          action: `Verifique o registro: ${index + 1}`,
        });

      return {
        clockedAt: date,
      };
    });
    const worker = await workerModel.findUniqueBy({ id: workerId });
    if (!workerId || !worker)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID informado",
      });

    const isManagerFormEstablishment =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        establishmentId: worker.establishment_id,
        managerId: session.user.id,
      });

    if (!isManagerFormEstablishment) throw new ForbiddenError();

    const establishmentCoords = await establishmentModel.getLocaleInfos({
      establishmentId: worker.establishment_id,
    });

    if (!establishmentCoords)
      throw new NotFoundError({
        message: "Dados de localização do estabelecimento não encontrado",
        action:
          "Verifique se os dados de localização do estabelecimento estâo cadastrados",
      });

    const { count } = await clockinModel.managerRegister({
      managerId: session.user.id,
      workerId,
      establishmentCoords,
      registers: registersNormalized,
    });

    return NextResponse.json(
      { message: `${count} novos registros criados` },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message || "Ocorreu um erro interno",
        action: error.action || "Contate o suporte",
      },
      { status: error.status_code || 500 },
    );
  }
};
