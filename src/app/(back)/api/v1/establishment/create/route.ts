import { NextRequest, NextResponse } from "next/server";

import { InputError, UnauthorizedError } from "@/src/Errors/errors";

//models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { auth } from "@/auth";

export const POST = async (request: NextRequest) => {
  try {
    const { name, phone, email, cep, lat, lng } = await request.json();
    if (!name || !phone || !email || !cep || !lat || !lng)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        status_code: 400,
        action:
          "Informe nome, telefone, email, cep, latitude e longitude do estabelecimento",
      });

    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const createdEstablishment = await establishmentModel.create({
      name,
      phone,
      email,
      cep,
      lat,
      lng,
      creatorId: session.user.id,
    });
    return NextResponse.json(createdEstablishment, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
        action: error.action || "Contact the suport",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
