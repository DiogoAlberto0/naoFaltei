import { auth } from "@/auth";
import { establishmentModel } from "@/src/app/(back)/models/establishment/establishment";
import { workerModel } from "@/src/app/(back)/models/worker/worker";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId } = await params;
    const workerToDelete = await workerModel.findUniqueBy({ id: workerId });
    if (!workerToDelete)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID informado do funcionário",
      });

    const isAuthorFromEstablishment =
      await establishmentModel.verifyIfIsAuthorFromEstablishment({
        authorId: session.user.id,
        establishmentId: workerToDelete.establishment_id,
      });

    if (!isAuthorFromEstablishment) throw new ForbiddenError();

    await workerModel.disable(workerToDelete.id);
    console.log("parou aqui");

    return NextResponse.json({
      message: "Funcionário excluido com sucesso",
    });
  } catch (error: any) {
    if (!error.status_code) {
      console.error(error);
    }
    return NextResponse.json(
      {
        message: error.message || "Ocorreu um erro interno",
        action: error.actio || "Contate o suporte",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
