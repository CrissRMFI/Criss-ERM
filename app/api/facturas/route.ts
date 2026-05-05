import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clienteId = searchParams.get("clienteId");

  const facturas = await prisma.factura.findMany({
    where: clienteId ? { clienteId } : undefined,
    include: { lineas: true, pagos: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(facturas, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  // Transacción atómica: incrementar número y crear factura juntos
  const factura = await prisma.$transaction(async (tx) => {
    const config = await tx.config.update({
      where: { id: "singleton" },
      data: { ultimoNumeroFactura: { increment: 1 } },
    });

    return tx.factura.create({
      data: {
        numero: config.ultimoNumeroFactura,
        fecha: body.fecha,
        cliente: body.cliente,
        subtotal: body.subtotal,
        saldoAnterior: body.saldoAnterior ?? 0,
        totalGeneral: body.totalGeneral,
        totalPagado: body.totalPagado,
        saldoPendiente: body.saldoPendiente,
        cajaDeuda: Math.floor(parseInt(body.cajaDeuda) || 0),
        cajaDejo: Math.floor(parseInt(body.cajaDejo) || 0),
        cajaRetiro: Math.floor(parseInt(body.cajaRetiro) || 0),
        cajaNuevoSaldo: Math.floor(parseInt(body.cajaNuevoSaldo) || 0),
        observaciones: body.observaciones ?? "",
        lineas: {
          create: body.lineas.map((l: any) => ({
            nombre: l.nombre,
            qty: l.qty,
            precio: l.precio,
            subtotal: l.qty * l.precio,
          })),
        },
        pagos: {
          create: body.pagos.map((p: any) => ({
            tipo: p.tipo,
            detalle: p.detalle ?? "",
            monto: p.monto,
          })),
        },
      },
      include: { lineas: true, pagos: true },
    });
  });

  return NextResponse.json(factura, {
    headers: { "Cache-Control": "no-store" },
    status: 201,
  });
}
