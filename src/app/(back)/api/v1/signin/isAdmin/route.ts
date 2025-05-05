import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

//errors
import { UnauthorizedError } from "@/src/Errors/errors";
import { workerModel } from "@/src/app/(back)/models/worker";
import { userModel } from "@/src/app/(back)/models/user";

export const GET = async (request: NextRequest) => {
  try {
    if (!request.headers.get("cookie")) throw new UnauthorizedError();

    const session = await auth();

    if (session == null) throw new UnauthorizedError();
    const worker = await workerModel.findUniqueBy({ id: session.user.id });
    const author = await userModel.findBy({ id: session.user.id });

    if (!worker && !author) throw new UnauthorizedError();
    return NextResponse.json(
      {
        is_admin: author || worker?.is_admin ? true : false,
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
