import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Traer la factura
    const factura = await prisma.factura.findUnique({
      where: { id: params.id },
    });

    if (!factura) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 },
      );
    }

    if (factura.anulada) {
      return NextResponse.json(
        { error: "La factura ya está anulada" },
        { status: 400 },
      );
    }

    // Verificar que sea la última factura del cliente
    if (factura.clienteId) {
      const ultimaFactura = await prisma.factura.findFirst({
        where: {
          clienteId: factura.clienteId,
          anulada: false,
        },
        orderBy: { createdAt: "desc" },
      });

      if (ultimaFactura?.id !== factura.id) {
        return NextResponse.json(
          { error: "Solo se puede anular la última factura del cliente" },
          { status: 400 },
        );
      }
    }

    // Anular
    const anulada = await prisma.factura.update({
      where: { id: params.id },
      data: {
        anulada: true,
        anuladaAt: new Date(),
      },
    });

    return NextResponse.json(anulada);
  } catch {
    return NextResponse.json({ error: "Error al anular" }, { status: 500 });
  }
}
