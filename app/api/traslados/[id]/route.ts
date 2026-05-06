import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const traslado = await prisma.traslado.findUnique({
    where: { id: params.id },
    include: {
      origen: true,
      destino: true,
      lineas: { include: { producto: true } },
    },
  });

  if (!traslado) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(traslado);
}
