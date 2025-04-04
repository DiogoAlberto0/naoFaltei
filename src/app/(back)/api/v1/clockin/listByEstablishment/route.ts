import { auth } from "@/auth";
import { clockinModel } from "@/src/app/(back)/models/clockin";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { NextRequest, NextResponse } from "next/server";

const validateAndExtractParams = (searchParams: URLSearchParams) => {
  const establishmentId = searchParams.get("establishmentId");
  const pageString = searchParams.get("page");
  const pageSizeString = searchParams.get("pageSize");

  if (!establishmentId)
    throw new InputError({
      message: "ID do estabelecimento não informado",
      action: "Informe o ID do estabelecimento na URL",
    });

  const page = Number(pageString);
  const pageSize = Number(pageSizeString);
  if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0)
    throw new InputError({
      message: "Página e quantidade por página inválidos",
      action:
        "A página e a quantidade devem ser valores numéricos maiores que 0",
    });

  return { establishmentId, page, pageSize };
};
export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { establishmentId, page, pageSize } = validateAndExtractParams(
      request.nextUrl.searchParams,
    );

    const establishment = await establishmentModel.findBy({
      id: establishmentId,
    });
    if (!establishment)
      throw new NotFoundError({
        message: "Estabelecimento não encontrado",
        action: "Verifique o ID do estabelecimento",
      });
    const isManagerFromDB =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        managerId: session.user.id,
        establishmentId,
      });

    if (!isManagerFromDB) throw new ForbiddenError();

    const lastRegisters = await clockinModel.getLastRegistersByEstablishment(
      establishmentId,
      page,
      pageSize,
    );

    return NextResponse.json({
      lastRegisters,
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
