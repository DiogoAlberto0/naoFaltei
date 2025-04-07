import { auth } from "@/auth";
import { clockinModel } from "@/src/app/(back)/models/clockin";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { dateUtils } from "@/src/utils/date";
import { NextRequest, NextResponse } from "next/server";

const validateAndExtractParams = (searchParams: URLSearchParams) => {
  const inicialDateString = searchParams.get("inicialDate");
  const finalDateString = searchParams.get("finalDate");

  if (!inicialDateString || !finalDateString)
    throw new InputError({
      message: "Periodo não informado.",
      action: "Informe o periodo de busca. Data inicial e final.",
    });

  const inicialDate = dateUtils.validateAndReturnDate(inicialDateString);
  const finalDate = dateUtils.validateAndReturnDate(finalDateString);

  if (dateUtils.calculateFullDaysBetween(inicialDate, finalDate) > 60)
    throw new InputError({
      message: "Período de busca muito longo",
      action:
        "Selecione um intervalo de no máximo 60 dias para realizar a busca.",
    });

  return { inicialDate, finalDate };
};
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId } = await params;
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

    if (!isManagerFromEstablishment && session.user.id !== worker.id)
      throw new ForbiddenError();

    const { inicialDate, finalDate } = validateAndExtractParams(
      request.nextUrl.searchParams,
    );

    const timeSheet = await clockinModel.getTimeSheetByWorker({
      workerId,
      inicialDate,
      finalDate,
    });

    const { totalAbscent, totalMedicalLeave, totalTimeBalance } =
      await clockinModel.getTotalSumariesData(workerId, inicialDate, finalDate);

    return NextResponse.json({
      timeSheet,
      totalAbscent,
      totalTimeBalance,
      totalMedicalLeave,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Ocorreu um erro interno",
        action: error.action || "Contate o suporte",
      },
      { status: error.status_code || 500 },
    );
  }
};
