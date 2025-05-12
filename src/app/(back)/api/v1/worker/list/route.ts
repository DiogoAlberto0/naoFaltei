// next
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

//model
import { establishmentModel } from "@/src/app/(back)/models/establishment/establishment";
import { workerModel } from "@/src/app/(back)/models/worker/worker";

//errors
import {
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";

const getAndValidateQueryParams = (searchParams: URLSearchParams) => {
  const pageSize = searchParams.get("pageSize");
  const page = searchParams.get("page");

  if (!page || !pageSize)
    throw new InputError({
      message: "Parâmetros de paginação não informados",
      action: "Favor informar os parâmetros page e pageSize",
    });

  const pageNumber = parseInt(page);
  const pageSizeNumber = parseInt(pageSize);

  if (
    isNaN(pageNumber) ||
    isNaN(pageSizeNumber) ||
    pageNumber < 1 ||
    pageSizeNumber < 1
  )
    throw new InputError({
      message: "Parâmetros de paginação inválidos",
      action:
        "Favor invormar os parâmetros page e pageSize como inteiros maior que 0",
    });

  const establishmentId = searchParams.get("establishmentId");
  if (!establishmentId)
    throw new InputError({
      message: "Estabelecimento não informado",
      action: "Informe o ID do estabelecimento para a listagem de funcionários",
    });

  return {
    establishmentId,
    page: pageNumber,
    pageSize: pageSizeNumber,
  };
};
export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const searchParams = request.nextUrl.searchParams;

    const { establishmentId, page, pageSize } =
      getAndValidateQueryParams(searchParams);

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
        establishmentId: establishmentId,
      });
    if (!isManagerFromDB) throw new ForbiddenError();

    const workers = await workerModel.listByEstablishment({
      establishmentId,
      page,
      pageSize,
    });

    const counter = await workerModel.count({
      establishmentId,
    });

    return NextResponse.json({
      workers,
      meta: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(counter / pageSize),
        totalItems: counter,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Ocorreu um erro interno",
        action: error.action || "Contete o suporte",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
