import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const ultimaFactura = await prisma.factura.findFirst({
    where: {
      clienteId: params.id,
      anulada: false,
    },
    orderBy: { createdAt: "desc" },
    select: {
      saldoPendiente: true,
      cajaNuevoSaldo: true,
    },
  });

  return NextResponse.json(
    {
      deudaMonetaria: ultimaFactura?.saldoPendiente ?? 0,
      deudaCajas: ultimaFactura?.cajaNuevoSaldo ?? 0,
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
