import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const traslados = await prisma.traslado.findMany({
    include: {
      origen: true,
      destino: true,
      lineas: {
        include: { producto: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(traslados, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.lineas?.length) {
    return NextResponse.json(
      { error: "Agregá al menos un producto" },
      { status: 400 },
    );
  }

  // Transacción: crear traslado + ajustar stock
  const traslado = await prisma.$transaction(async (tx) => {
    for (const linea of body.lineas) {
      // Verificar stock disponible en el lote
      const lote = await tx.stockLote.findUnique({
        where: { id: linea.loteId },
      });

      if (!lote || lote.cantidad < linea.cantidad) {
        throw new Error(`Stock insuficiente para el lote seleccionado`);
      }

      // Descontar del lote origen
      await tx.stockLote.update({
        where: { id: linea.loteId },
        data: { cantidad: { decrement: linea.cantidad } },
      });

      // Agregar al destino como nuevo lote
      await tx.stockLote.create({
        data: {
          almacenId: body.destinoId,
          productoId: linea.productoId,
          cantidad: linea.cantidad,
          precioCosto: linea.precioCosto,
        },
      });
    }

    return tx.traslado.create({
      data: {
        origenId: body.origenId,
        destinoId: body.destinoId,
        fecha: body.fecha,
        observaciones: body.observaciones ?? "",
        lineas: {
          create: body.lineas.map((l: any) => ({
            productoId: l.productoId,
            cantidad: l.cantidad,
            precioCosto: l.precioCosto,
          })),
        },
      },
      include: {
        origen: true,
        destino: true,
        lineas: { include: { producto: true } },
      },
    });
  });

  return NextResponse.json(traslado, { status: 201 });
}
