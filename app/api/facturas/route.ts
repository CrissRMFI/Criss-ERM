import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const facturas = await prisma.factura.findMany({
    include: { lineas: true, pagos: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(facturas);
}

export async function POST(req: Request) {
  const body = await req.json();

  // Obtener y incrementar número de factura atómicamente
  const config = await prisma.config.update({
    where: { id: "singleton" },
    data: { ultimoNumeroFactura: { increment: 1 } },
  });

  const factura = await prisma.factura.create({
    data: {
      numero: config.ultimoNumeroFactura,
      fecha: body.fecha,
      cliente: body.cliente,
      subtotal: body.subtotal,
      saldoAnterior: body.saldoAnterior ?? 0,
      totalGeneral: body.totalGeneral,
      totalPagado: body.totalPagado,
      saldoPendiente: body.saldoPendiente,
      cajaDeuda: body.cajaDeuda ?? "",
      cajaDejo: body.cajaDejo ?? "",
      cajaRetiro: body.cajaRetiro ?? "",
      cajaNuevoSaldo: body.cajaNuevoSaldo ?? 0,
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

  return NextResponse.json(factura, { status: 201 });
}
