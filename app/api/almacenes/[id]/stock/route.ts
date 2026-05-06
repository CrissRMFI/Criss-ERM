import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  // Agrupar lotes por producto y sumar cantidades
  const lotes = await prisma.stockLote.findMany({
    where: {
      almacenId: params.id,
      cantidad: { gt: 0 },
    },
    include: { producto: true },
    orderBy: { createdAt: "asc" },
  });

  // Agrupar por producto con sus lotes detallados
  const porProducto = lotes.reduce((acc: any, lote) => {
    const key = lote.productoId;
    if (!acc[key]) {
      acc[key] = {
        productoId: lote.productoId,
        nombre: lote.producto.nombre,
        precioVenta: lote.producto.precio,
        cantidadTotal: 0,
        lotes: [],
      };
    }
    acc[key].cantidadTotal += lote.cantidad;

    // Consolidar lotes con el mismo precio costo
    const loteExistente = acc[key].lotes.find(
      (l: any) => l.precioCosto === lote.precioCosto,
    );
    if (loteExistente) {
      loteExistente.cantidad += lote.cantidad;
    } else {
      acc[key].lotes.push({
        id: lote.id,
        cantidad: lote.cantidad,
        precioCosto: lote.precioCosto,
        createdAt: lote.createdAt,
      });
    }

    return acc;
  }, {});

  return NextResponse.json(Object.values(porProducto), {
    headers: { "Cache-Control": "no-store" },
  });
}
