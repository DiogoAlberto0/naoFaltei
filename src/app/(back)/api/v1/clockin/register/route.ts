import { auth } from "@/auth";
import { clockinModel } from "@/src/app/(back)/models/clockin";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { coordinateUtils } from "@/src/utils/coordinate";
import { NextRequest, NextResponse } from "next/server";

const verifyIfIsTardiness = ({
  dateTime,
  expectedHour,
  expectedMinute,
}: {
  dateTime: Date;
  expectedHour: number;
  expectedMinute: number;
}) => {
  const currentHour = dateTime.getHours();
  const currentMinute = dateTime.getMinutes();

  if (currentHour > expectedHour) return true;
  if (currentHour === expectedHour && currentMinute > expectedMinute)
    return true;
  return false;
};

export const POST = async (request: NextRequest) => {
  try {
    const dateTime = new Date();
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { lat, lng } = await request.json();

    const { lat: latNum, lng: lngNum } = coordinateUtils.validateAndParse({
      lat,
      lng,
    });

    const worker = await workerModel.findUniqueBy({ id: session.user.id });
    if (!worker)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID informado",
      });

    const localeEstablishment = await establishmentModel.getLocaleInfos({
      workerId: worker.id,
    });

    if (!localeEstablishment)
      throw new BadRequestError({
        message: "Estabelecimento do funcionário não encontrado",
        action: "Verifique o ID informado do funcionário",
      });

    const { isOnRatio, distance } = coordinateUtils.isOnRatio(
      latNum,
      lngNum,
      localeEstablishment.lat,
      localeEstablishment.lng,
      localeEstablishment.ratio,
    );

    if (!isOnRatio)
      throw new BadRequestError({
        message: `Você está fora do raio de atuação do establecimento. Raio de atuação: ${localeEstablishment.ratio}Km.`,
        action: `Se aproxime mais do estabelecimento. Sua distância: ${Math.round(distance)}Km.`,
      });

    const schedule = await workerModel.getScheduleByDay(
      worker.id,
      dateTime.getDay(),
    );
    const isTardiness = schedule
      ? verifyIfIsTardiness({
          dateTime,
          expectedHour: schedule.start_hour,
          expectedMinute: schedule.start_minute,
        })
      : false;
    const lastRegister = await clockinModel.getLastRegisterToday(worker.id);

    await clockinModel.register({
      dateTime,
      isEntry: !lastRegister || !lastRegister.is_entry,
      isTardiness: lastRegister ? false : isTardiness,
      lat: latNum,
      lng: lngNum,
      workerId: worker.id,
    });

    return NextResponse.json({ message: "Ponto registrado com sucesso" });
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
