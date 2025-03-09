//next
import { NextRequest, NextResponse } from "next/server";

// model user
import { userModel } from "@/src/models/user";
import {
  ForbiddenError,
  InputError,
  UnauthorizedError,
} from "@/src/Errors/errors";

// authjs
import { auth } from "@/auth";
import { establishmentModel } from "@/src/models/establishment";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { name, cpf, email, password, establishmentId } =
      await request.json();
    if (!name || !cpf || !email || !password || !establishmentId)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        action:
          "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        status_code: 400,
      });

    const establishments = await establishmentModel.listByManager({
      managerId: session.user.id,
    });
    const isManagerFromEstablishment = establishments.some(
      ({ id }) => establishmentId === id
    );
    if (!isManagerFromEstablishment) throw new ForbiddenError();

    const createdUser = await userModel.create({
      email,
      password,
      name,
      cpf,
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
      }
    );
  }
};
