import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// model
import { workerModel } from "@/src/app/(back)/models/worker/worker";
import { rootModel } from "@/src/app/(back)/models/root/root";

// errors
import { InputError, UnauthorizedError } from "@/src/Errors/errors";

// utils
import { dateUtils } from "@/src/utils/date";

const extractAndValidateSearchParams = (searchParams: URLSearchParams) => {
  const defaultInicialDate = new Date();
  defaultInicialDate.setUTCMonth(defaultInicialDate.getUTCMonth() - 2);

  const defaultFinalDate = new Date();
  const inicialDate =
    searchParams.get("inicialDate") || defaultInicialDate.toISOString();
  const finalDate =
    searchParams.get("finalDate") || defaultFinalDate.toISOString();

  const periodSearchParams = searchParams.get("period") || "day";

  if (!dateUtils.isISODate(inicialDate))
    throw new InputError({
      message: "Data inicial não informada ou no formato incorreto",
      action:
        "Informe uma data inicial para busca no seguinte formato: YYYY-MM-DD",
    });

  if (!dateUtils.isISODate(finalDate))
    throw new InputError({
      message: "Data inicial não informada ou no formato incorreto",
      action:
        "Informe uma data inicial para busca no seguinte formato: YYYY-MM-DD",
    });

  if (
    periodSearchParams !== "day" &&
    periodSearchParams !== "month" &&
    periodSearchParams !== "week"
  )
    throw new InputError({
      message: "Periodo inválido informado",
      action: "O periodo deve ser: 'day', 'week' ou 'month' ",
    });

  const period: "day" | "month" | "week" = periodSearchParams;
  return {
    inicialDate: new Date(inicialDate),
    finalDate: new Date(finalDate),
    period,
  };
};
export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const rootWorker = await rootModel.findUniqueById({ id: session.user.id });
    if (!rootWorker) throw new UnauthorizedError();

    const searchParams = request.nextUrl.searchParams;

    const { inicialDate, finalDate, period } =
      extractAndValidateSearchParams(searchParams);

    const newWorkersPerPeriod = await workerModel.countPeriod({
      period,
      inicialDate,
      finalDate,
    });
    const totalWorkers = await workerModel.count();

    return NextResponse.json({
      newWorkersPerPeriod,
      inicialDate,
      finalDate,
      period,
      totalWorkers,
    });
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
