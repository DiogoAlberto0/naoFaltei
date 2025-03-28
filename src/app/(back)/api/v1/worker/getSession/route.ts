import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

//errors
import { UnauthorizedError } from "@/src/Errors/errors";

export const GET = async (request: NextRequest) => {
  try {
    if (!request.headers.get("cookie")) throw new UnauthorizedError();

    const session = await auth();

    if (session == null) throw new UnauthorizedError();
    return NextResponse.json({ session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        action: "Contate o suporte",
      },
      {
        status: error.status_code || 500,
      },
    );
  }
};
