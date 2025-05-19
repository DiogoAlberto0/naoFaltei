import { auth } from "@/auth";
import { workerModel } from "@/src/app/(back)/models/worker/worker";
import {
  InputError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const worker = await workerModel.findUniqueBy({ id: session.user.id });

    if (!worker)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID do funcionário informado",
      });

    const { login, password } = await request.json();

    if (!login || !password)
      throw new InputError({
        message: "Informações obrigatórias faltando",
        action: "Informe login e senha para alteração",
      });

    await workerModel.update({
      id: worker.id,
      name: worker.name,
      phone: worker.phone,
      email: worker.email,
      cpf: worker.cpf,
      login,
      password,
      isManager: worker.is_manager,
    });

    return NextResponse.json(
      {},
      {
        status: 200,
      },
    );
  } catch (error: any) {
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
