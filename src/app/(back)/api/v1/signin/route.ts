import { signIn } from "@/auth";
import { InputError } from "@/src/Errors/errors";
import { userModel } from "@/src/app/(back)/models/user/user";
import { workerModel } from "@/src/app/(back)/models/worker/worker";
import { passwordUtils } from "@/src/utils/password";
import { NextRequest, NextResponse } from "next/server";
import { rootModel } from "../../../models/root/root";

export const POST = async (request: NextRequest) => {
  try {
    const { login, password, root } = await request.json();

    if (!login || !password)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        action: "Informe nome, email e senha do usuário",
        status_code: 400,
      });

    const isRoot = root === true;

    let foundUser;

    const [worker, user, rootUser] = await Promise.all([
      workerModel.findUniqueBy({ login: login as string }),
      userModel.findBy({ email: login as string }),
      rootModel.findUniqueByLogin({ login: login as string }),
    ]);

    foundUser = worker || user;

    if (isRoot) {
      foundUser = rootUser;
    }

    if (!foundUser) throw new Error();

    if (!foundUser.hash) throw new Error();

    if (!passwordUtils.comparePassAndHash(password, foundUser.hash))
      throw new Error();

    const formData = new FormData();
    formData.append("login", login);
    formData.append("password", password);
    formData.append("isRoot", isRoot.toString());

    await signIn("credentials", formData);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    if (error.message == "NEXT_REDIRECT") {
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(
      {
        message:
          "Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.",
        action: "Se o erro persistir contate o suporte.",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
