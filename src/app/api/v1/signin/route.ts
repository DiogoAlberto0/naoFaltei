import { signIn } from "@/auth";
import { InputError, UnauthorizedError } from "@/src/Errors/errors";
import { workerModel } from "@/src/models/worker";
import { passwordUtils } from "@/src/utils/password";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { login, password } = await request.json();

    if (!login || !password)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        action: "Informe nome, email e senha do usuário",
        status_code: 400,
      });

    const existentUser = await workerModel.findBy({
      login,
    });

    if (!existentUser)
      throw new InputError({
        message: "Usuário ou senha incorretos",
        action: "Verifique os campos informados.",
      });

    if (!existentUser.hash) throw new UnauthorizedError();

    if (!passwordUtils.comparePassAndHash(password, existentUser.hash))
      throw new InputError({
        message: "Usuário ou senha incorretos",
        action: "Verifique os campos informados.",
      });
    const formData = new FormData();
    formData.append("login", login);
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
      },
    );
  }
};
