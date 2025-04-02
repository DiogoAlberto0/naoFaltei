import { auth } from "@/auth";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { ForbiddenError, UnauthorizedError } from "@/src/Errors/errors";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ establishmentId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { establishmentId } = await params;
    const isManagerFromEstablishment =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        establishmentId,
        managerId: session.user.id,
      });
    if (!isManagerFromEstablishment) throw new ForbiddenError();

    const establishment = await establishmentModel.findBy({
      id: establishmentId,
    });

    return NextResponse.json(establishment);
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
