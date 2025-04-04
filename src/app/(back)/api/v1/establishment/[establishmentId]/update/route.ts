import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Errors
import { UnauthorizedError, ForbiddenError } from "@/src/Errors/errors";

// models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { coordinateUtils } from "@/src/utils/coordinate";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ establishmentId: string }> },
) => {
  try {
    const session = await auth();
    if (!session || !session.user) throw new UnauthorizedError();

    const { name, phone, email, cep, coords, ratio } = await request.json();

    let lat: number | undefined = undefined;
    let lng: number | undefined = undefined;
    if (coords) {
      const { lat: latNum, lng: lngNum } =
        coordinateUtils.validateAndParse(coords);
      lat = latNum;
      lng = lngNum;
    }

    const { establishmentId } = await params;

    const isManagerFromEstablishment =
      await establishmentModel.verifyIfIsAuthorFromEstablishment({
        authorId: session.user.id,
        establishmentId,
      });

    if (!isManagerFromEstablishment) throw new ForbiddenError();

    const updatedEstablishment = await establishmentModel.update({
      id: establishmentId,
      name,
      phone,
      email,
      cep,
      ratio,
      lat: lat && lng ? lat : undefined,
      lng: lat && lng ? lng : undefined,
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
      },
    );
  }
};
