import { signIn } from "@/auth";
import { InputError, UnauthorizedError } from "@/src/Errors/errors";
import { userModel } from "@/src/models/user";
import { passwordUtils } from "@/src/utils/password";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        action: "Informe nome, email e senha do usuário",
        status_code: 400,
      });

    const existentUser = await userModel.findBy({
      email,
    });

    if (!existentUser)
      throw new InputError({
        message: "Usuário não encontrado",
        action: "Contate o suporte",
      });

    if (!existentUser.hash) throw new UnauthorizedError();

    if (!passwordUtils.comparePassAndHash(password, existentUser.hash))
      throw new InputError({
        message: "Senha incorreta",
      });
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await signIn("credentials", formData);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    if (error.message == "NEXT_REDIRECT") {
      return NextResponse.json({}, { status: 200 });
    }

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
