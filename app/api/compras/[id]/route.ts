import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const compra = await prisma.compra.findUnique({
    where: { id: params.id },
    include: {
      proveedor: true,
      lineas: { include: { producto: true } },
      pagos: true,
    },
  });

  if (!compra) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  return NextResponse.json(compra);
}
