import { NextResponse } from "next/server";
import { auth } from "@/auth";

// model
import { clockinModel } from "@/src/app/(back)/models/clockin/clockin";
import { workerModel } from "@/src/app/(back)/models/worker";

// errors
import { NotFoundError, UnauthorizedError } from "@/src/Errors/errors";

export const GET = async () => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const worker = await workerModel.findUniqueBy({
      id: session.user.id,
    });

    if (!worker)
      throw new NotFoundError({
        message: "Falha ao encontrar funcionário",
        action: "Verifique o ID do funcionário",
      });

    const lastTwoRegisters = await clockinModel.getLastTwoRegisters(worker.id);

    return NextResponse.json({
      lastTwoRegisters,
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
