//next
import { NextRequest, NextResponse } from "next/server";

// model user
import { userModel } from "@/src/models/user";
import { InputError } from "@/src/Errors/errors";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        action: "Informe nome, email e senha do usuário",
        status_code: 400,
      });

    const createdUser = await userModel.create({ email, password, name });

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
