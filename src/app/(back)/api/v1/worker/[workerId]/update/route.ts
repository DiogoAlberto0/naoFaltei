import { auth } from "@/auth";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/Errors/errors";
import { NextRequest, NextResponse } from "next/server";

//utils
import { omit } from "lodash";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { workerId } = await params;
    const worker = await workerModel.findUniqueBy({ id: workerId });
    if (!worker)
      throw new NotFoundError({
        message: "Funcionário não encontrado",
        action: "Verifique o ID do funcionário informado",
      });

    const isManagerFromEstablishment =
      await establishmentModel.verifyIfManagerIsFromEstablishment({
        establishmentId: worker.establishment_id,
        managerId: session.user.id,
      });
    if (!isManagerFromEstablishment) throw new ForbiddenError();

    const { name, phone, email, cpf, login, password, is_manager } =
      await request.json();

    const newWorkerData = await workerModel.update({
      id: workerId,
      name: name || worker.name,
      phone: phone || worker.phone,
      email: email || worker.email,
      cpf: cpf || worker.cpf,
      login: login || worker.login,
      password: password,
      isManager:
        typeof is_manager == "boolean" ? is_manager : worker.is_manager,
    });

    return NextResponse.json(
      {
        ...omit(newWorkerData, "hash"),
      },
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
