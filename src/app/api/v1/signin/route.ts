import { signIn } from "@/auth";
import { InputError } from "@/src/Errors/errors";
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

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const signin = await signIn("credentials", formData);

    return NextResponse.json({
      signin,
    });
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
