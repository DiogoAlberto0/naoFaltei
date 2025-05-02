//next
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// model
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";

//error
import { NotFoundError, UnauthorizedError } from "@/src/Errors/errors";

export const GET = async () => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const worker = await workerModel.findUniqueBy({ id: session.user.id });
    if (!worker)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID informado do funcionário",
      });

    const establishment = await establishmentModel.findBy({
      id: worker.establishment_id,
    });

    if (!establishment)
      throw new NotFoundError({
        message: "Estabelecimento não encontrado",
        action: "Verifique o ID informado do estabelecimento",
      });

    return NextResponse.json({
      lat: establishment.lat,
      lng: establishment.lng,
      ratio: establishment.ratio,
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
