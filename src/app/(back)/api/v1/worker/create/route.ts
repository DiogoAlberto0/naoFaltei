//next
import { NextRequest, NextResponse } from "next/server";

// model user
import { workerModel } from "@/src/app/(back)/models/worker/worker";
import {
  ForbiddenError,
  InputError,
  UnauthorizedError,
} from "@/src/Errors/errors";

// authjs
import { auth } from "@/auth";
import { establishmentModel } from "@/src/app/(back)/models/establishment/establishment";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { name, cpf, phone, login, email, password, establishmentId } =
      await request.json();
    if (
      !name ||
      !cpf ||
      !phone ||
      !cpf ||
      !email ||
      !password ||
      !establishmentId
    )
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        action:
          "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        status_code: 400,
      });

    const isManagerFromEstablishment =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        managerId: session.user.id,
        establishmentId,
      });
    if (!isManagerFromEstablishment) throw new ForbiddenError();

    const createdUser = await workerModel.create({
      name,
      email,
      phone,
      cpf,
      login,
      password,
      establishmentId,
    });

    return NextResponse.json(createdUser, { status: 201 });
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
