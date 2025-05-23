import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

//errors
import { UnauthorizedError } from "@/src/Errors/errors";
import { rootModel } from "@/src/app/(back)/models/root/root";

export const GET = async (request: NextRequest) => {
  try {
    if (!request.headers.get("cookie")) throw new UnauthorizedError();

    const session = await auth();

    if (session == null) throw new UnauthorizedError();
    const root = await rootModel.findUniqueById({ id: session.user.id });

    if (!root) throw new UnauthorizedError();
    return NextResponse.json(
      {
        is_root: true,
      },
      { status: 200 },
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
