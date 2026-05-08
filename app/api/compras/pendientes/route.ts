import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const compras = await prisma.compra.findMany({
    where: {
      lineas: {
        some: {
          cantidadRetirada: { lt: prisma.compraLinea.fields.cantidadTotal },
        },
      },
    },
    include: {
      lineas: {
        where: {
          cantidadRetirada: { lt: prisma.compraLinea.fields.cantidadTotal },
        },
        include: { producto: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(compras, {
    headers: { "Cache-Control": "no-store" },
  });
}
