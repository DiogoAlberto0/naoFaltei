import { auth } from "@/auth";
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { establishmentModel } from "@/src/models/establishment";
import { userModel } from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ establishmentId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { establishmentId } = await params;
    const establishment = await establishmentModel.findBy({
      id: establishmentId,
    });

    if (!establishment)
      throw new NotFoundError({
        message: "Estabelecimento não encontrado.",
        action: "Verifique se o ID do estabelecimento está correto",
      });

    if (establishment.author_id !== session.user.id) throw new ForbiddenError();

    const { newManagerEmail } = await request.json();
    if (!newManagerEmail)
      throw new InputError({
        message: "Campos obrigatórios faltando",
        action: "Informe o email do novo gerênte",
      });

    const newManager = await userModel.findBy({
      email: newManagerEmail,
    });

    if (!newManager)
      throw new NotFoundError({
        message: "Novo gerênte não encontrado",
        action: "Verifique se o email do novo gerênte está correto",
      });

    await establishmentModel.addManager({
      managerId: newManager.id,
      establishmentId,
      isValidEstablishment: true,
      isValidManager: true,
    });

    return NextResponse.json(
      { message: "Novo gerênte adicionado com sucesso" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        action: error.action || "Contate o suporte.",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
