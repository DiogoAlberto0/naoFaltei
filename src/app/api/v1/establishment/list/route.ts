import { NextResponse } from "next/server";
import { auth } from "@/auth";

// models
import { establishmentModel } from "@/src/models/establishment";

// Errors
import { UnauthorizedError } from "@/src/Errors/errors";

export const GET = async () => {
  try {
    const session = await auth();
    console.log(session);
    if (!session || !session.user) throw new UnauthorizedError();

    const establishments = await establishmentModel.listByManager({
      managerId: session.user.id,
    });

    return NextResponse.json({
      establishments,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        action: error.action || "Contate o suport",
      },
      {
        status: error.status_code || 500,
      }
    );
  }
};
