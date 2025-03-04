//next
import { NextRequest, NextResponse } from "next/server";
//utils
import { isValidEmail, isValidPassword } from "@/src/utils/validators";
// model user
import { userModel } from "@/src/models/user";

export const POST = async (request: NextRequest) => {
  const { email, password, name } = await request.json();

  if (!email || !isValidEmail(email))
    return NextResponse.json(
      {
        message: "Informe um email válido",
      },
      {
        status: 400,
      }
    );

  if (!password || !isValidPassword(password))
    return NextResponse.json(
      {
        message:
          "A senha deve conter pelomenos uma letra maiuscula e um caracter especial",
      },
      {
        status: 400,
      }
    );

  if (!name)
    return NextResponse.json(
      {
        message: "Informe o nome do usuário",
      },
      {
        status: 400,
      }
    );

  try {
    const existentUser = await userModel.findByEmail(email);

    if (existentUser)
      return NextResponse.json(
        {
          message: "Este email já está em uso por outro usuário",
        },
        {
          status: 409,
        }
      );
    await userModel.createUser({ email, password, name });

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Falha na conexão com banco de dados",
      },
      {
        status: 500,
      }
    );
  }
};
