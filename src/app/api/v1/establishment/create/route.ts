import { NextRequest, NextResponse } from "next/server";

import { InputError, UnauthorizedError } from "@/src/Errors/errors";

//models
import { establishmentModel } from "@/src/models/stablishment";

export const POST = async (request: NextRequest) => {
  const { name, phone, email, cep, lat, lng, managerId } = await request.json();
  try {
    if (!name || !phone || !email || !cep || !lat || !lng)
      throw new InputError({
        message: "Campos obrigatórios faltando.",
        status_code: 400,
        action:
          "Informe nome, telefone, email, cep, latitude e longitude do estabelecimento",
      });

    if (!managerId) throw new UnauthorizedError();

    const createdEstablishment = await establishmentModel.create({
      name,
      phone,
      email,
      cep,
      lat,
      lng,
      managerId,
    });
    return NextResponse.json(createdEstablishment);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
        action: error.action || "Contact the suport",
      },
      {
        status: error.status_code || 500,
      }
    );
  }
};
