import { auth } from "@/auth";
import {
  ForbiddenError,
  InputError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { establishmentModel } from "@/src/models/establishment";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ establishmentId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { establishmentId } = await params;

    const isAuthorFromEstablishment =
      await establishmentModel.verifyIfIsAuthorFromEstablishment({
        userId: session.user.id,
        establishmentId,
      });

    if (!isAuthorFromEstablishment) throw new ForbiddenError();

    const { managerId } = await request.json();

    if (!managerId)
      throw new InputError({
        message: "Campos obrigatórios faltando",
        action: "Informe o ID do gerênte a ser removido.",
      });

    if (managerId === session.user.id)
      throw new InputError({
        action: "Operação inválida",
        message: "Você não pode se desassociar do seu próprio estabelecimento",
      });
    await establishmentModel.removeManager({
      establishmentId,
      managerId,
    });

    return NextResponse.json(
      {
        message: "Gerênte removido com sucesso",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        action: error.action || "Contate o suporte",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
