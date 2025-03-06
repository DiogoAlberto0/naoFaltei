import { NextResponse } from "next/server";
import { headers } from "next/headers";

// models
import { establishmentModel } from "@/src/models/establishment";
import { userModel } from "@/src/models/user";

// Errors
import { UnauthorizedError } from "@/src/Errors/errors";

export const GET = async () => {
  try {
    const headersList = await headers();

    const managerId = headersList.get("authorization");
    if (!managerId) throw new UnauthorizedError();

    const manager = await userModel.findById(managerId);
    if (!manager) throw new UnauthorizedError();

    const establishments = await establishmentModel.listByManager({
      managerId,
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
