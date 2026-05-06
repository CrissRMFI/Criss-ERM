import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const almacenId = searchParams.get("almacenId");

  const traslados = await prisma.traslado.findMany({
    where: almacenId
      ? {
          OR: [{ origenId: almacenId }, { destinoId: almacenId }],
        }
      : undefined,
    include: {
      origen: true,
      destino: true,
      lineas: { include: { producto: true } },
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

  const traslado = await prisma.$transaction(async (tx) => {
    // Obtener almacén origen
    const origen = await tx.almacen.findUnique({
      where: { id: body.origenId },
    });
    if (!origen) throw new Error("Almacén origen no encontrado");

    // Incrementar número de movimiento
    const config = await tx.config.update({
      where: { id: "singleton" },
      data: { ultimoNumeroMovimiento: { increment: 1 } },
    });

    for (const linea of body.lineas) {
      const lote = await tx.stockLote.findUnique({
        where: { id: linea.loteId },
      });

      if (!lote) throw new Error("Lote no encontrado");

      // Solo CENTRAL y MOVIL no pueden quedar en negativo
      if (origen.tipo !== "EXTERNO" && lote.cantidad < linea.cantidad) {
        throw new Error(`Stock insuficiente para "${linea.nombre}"`);
      }

      // Descontar del lote origen
      await tx.stockLote.update({
        where: { id: linea.loteId },
        data: { cantidad: { decrement: linea.cantidad } },
      });

      // Agregar al destino
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
        numeroMovimiento: config.ultimoNumeroMovimiento,
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
