import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const { cantidad, almacenDestinoId } = body;

  const linea = await prisma.compraLinea.findUnique({
    where: { id: params.id },
  });

  if (!linea) {
    return NextResponse.json({ error: "Línea no encontrada" }, { status: 404 });
  }

  const pendiente = linea.cantidadTotal - linea.cantidadRetirada;

  if (cantidad > pendiente) {
    return NextResponse.json(
      { error: `Solo quedan ${pendiente} unidades pendientes` },
      { status: 400 },
    );
  }

  // Transacción: actualizar línea + crear lote en almacén
  await prisma.$transaction([
    prisma.compraLinea.update({
      where: { id: params.id },
      data: { cantidadRetirada: { increment: cantidad } },
    }),
    prisma.stockLote.create({
      data: {
        almacenId: almacenDestinoId,
        productoId: linea.productoId,
        cantidad,
        precioCosto: linea.precioCosto,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
