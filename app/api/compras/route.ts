import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const compras = await prisma.compra.findMany({
    include: {
      proveedor: true,
      lineas: { include: { producto: true } },
      pagos: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(compras, {
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

  const compra = await prisma.compra.create({
    data: {
      proveedorId: body.proveedorId ?? null,
      fecha: body.fecha,
      observaciones: body.observaciones ?? "",
      estado: "PENDIENTE",
      lineas: {
        create: body.lineas.map((l: any) => ({
          productoId: l.productoId,
          cantidadTotal: l.cantidadTotal,
          cantidadRetirada: 0,
          precioCosto: l.precioCosto,
        })),
      },
    },
    include: {
      proveedor: true,
      lineas: { include: { producto: true } },
      pagos: true,
    },
  });

  return NextResponse.json(compra, { status: 201 });
}
