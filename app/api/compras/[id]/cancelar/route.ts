import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const compra = await prisma.compra.findUnique({
    where: { id: params.id },
    include: {
      lineas: true,
      pagos: true,
    },
  });

  if (!compra) {
    return NextResponse.json(
      { error: "Compra no encontrada" },
      { status: 404 },
    );
  }

  if (compra.estado === "CANCELADA") {
    return NextResponse.json({ error: "Ya está cancelada" }, { status: 400 });
  }

  const advertencias: string[] = [];

  await prisma.$transaction(async (tx) => {
    // Revertir stock de cada línea retirada
    for (const linea of compra.lineas) {
      if (linea.cantidadRetirada === 0) continue;

      // Buscar lotes de este producto en cualquier almacén
      // que coincidan con el precio costo de la línea
      const lotes = await tx.stockLote.findMany({
        where: {
          productoId: linea.productoId,
          precioCosto: linea.precioCosto,
          cantidad: { gt: 0 },
        },
        orderBy: { createdAt: "asc" },
      });

      let aRevertir = linea.cantidadRetirada;

      for (const lote of lotes) {
        if (aRevertir <= 0) break;
        const descuento = Math.min(lote.cantidad, aRevertir);
        await tx.stockLote.update({
          where: { id: lote.id },
          data: { cantidad: { decrement: descuento } },
        });
        aRevertir -= descuento;
      }

      if (aRevertir > 0) {
        advertencias.push(
          `${aRevertir} u. de "${linea.productoId}" no pudieron revertirse — ya fueron vendidas o trasladadas`,
        );
      }
    }

    // Cancelar la compra
    await tx.compra.update({
      where: { id: params.id },
      data: {
        estado: "CANCELADA",
        canceladaAt: new Date(),
      },
    });
  });

  return NextResponse.json({
    ok: true,
    advertencias,
    totalPagado: compra.pagos.reduce((acc, p) => acc + p.monto, 0),
  });
}
