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
import { dateUtils } from "@/src/utils/date";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId, registers } = await request.json();

    const worker = await workerModel.findUniqueBy({ id: workerId });
    if (!worker)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o id do funcionário",
      });

    const isManagerFromDB =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        managerId: session.user.id,
        establishmentId: worker.establishment_id,
      });

    if (!isManagerFromDB) throw new ForbiddenError();

    const establishmentLocaleInfos = await establishmentModel.getLocaleInfos({
      establishmentId: worker.establishment_id,
    });

    if (!establishmentLocaleInfos)
      throw new NotFoundError({
        message:
          "Falha ao buscar as informações de localização do estabelecimento",
        action:
          "Verifique se o estabelecimento possui dados de localização cadastrados",
      });

    //Validando se os registros seguem a segunite estrutura:
    // Maximo 30 registros
    // registers: {
    //   clockedAt: IsoStringDate,
    //   isEntry: boolean
    // }[]
    if (!Array.isArray(registers))
      throw new InputError({
        message: "Os registros devem ser um array",
        action: "Verifique a propriedade `registers` no corpo da requisição",
      });

    if (registers.length <= 0)
      throw new InputError({
        message: "Nenhum registro foi informado",
        action: "Informe pelo menos 1 registro",
      });

    if (registers.length > 30)
      throw new InputError({
        message: "O máximo de registros por operação são 30",
        action: "Reduza o numero de registros",
      });
    const normalizedRegisters = registers.map((value: any, index) => {
      if (!dateUtils.isISODate(value.clockedAt))
        throw new InputError({
          message: "As datas do registro devem estar em formato ISO",
          action: `Verifique se o registro ${index + 1} está no formato ISO`,
        });
      const clockedAt = new Date(value.clockedAt);
      const isEntry = value.isEntry;
      if (typeof isEntry !== "boolean")
        throw new InputError({
          message: "A propriedade `isEntry` deve ser um valor booleano",
          action: `Verifique a propriedad "isEntry" do registro ${index + 1}`,
        });
      return { clockedAt, isEntry };
    });

    const { count } = await clockinModel.managerRegister({
      managerId: session.user.id,
      workerId: workerId,
      establishmentCoords: {
        lat: establishmentLocaleInfos.lat,
        lng: establishmentLocaleInfos.lng,
      },
      registers: normalizedRegisters,
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
