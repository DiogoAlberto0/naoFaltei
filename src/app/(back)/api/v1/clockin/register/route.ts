import { auth } from "@/auth";
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { coordinateUtils } from "@/src/utils/coordinate";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const clockedAt = new Date();
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

    await clockinModel.register({
      clocked_at: clockedAt,
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
