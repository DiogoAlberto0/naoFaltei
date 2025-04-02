//next
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// model
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";

//error
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";

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
        message: "Funcionário não encontrado",
        action: "Verifique o ID informado do funcionário",
      });

    const isManagerFromDB =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        establishmentId: worker.establishment_id,
        managerId: session.user.id,
      });
    if (!isManagerFromDB && session.user.id !== worker.id)
      throw new ForbiddenError();

    const schedule = await workerModel.getSchedule(workerId);
    return NextResponse.json(schedule);
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
