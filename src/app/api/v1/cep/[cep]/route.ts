import { cepModel } from "@/src/models/cep";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ cep: string }> }
) => {
  try {
    const { cep } = await params;

    const address = await cepModel.getAddres(cep);
    return NextResponse.json(
      {
        address,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
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
