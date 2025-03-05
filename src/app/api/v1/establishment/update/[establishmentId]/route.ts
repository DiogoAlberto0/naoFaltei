import { NextRequest, NextResponse } from "next/server";

// Errors
import { InputError } from "@/src/Errors/errors";

// models
import { establishmentModel } from "@/src/models/establishment";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ establishmentId: string }> }
) => {
  try {
    const { name, phone, email, cep, coords } = await request.json();

    if (coords && (!coords.lat || !coords.lng))
      throw new InputError({
        message: "Coordenadas inválidas",
        action:
          "Informe as coordenadas com os parametros 'lat' para latitude e 'lng' para longitude",
        status_code: 400,
      });

    const { establishmentId } = await params;

    const updatedEstablishment = await establishmentModel.update({
      id: establishmentId,
      name,
      phone,
      email,
      cep,
      lat: coords ? coords.lat : undefined,
      lng: coords ? coords.lng : undefined,
    });

    return NextResponse.json(updatedEstablishment);
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
