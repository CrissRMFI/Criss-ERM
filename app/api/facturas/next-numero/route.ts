import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await prisma.config.findUnique({
    where: { id: "singleton" },
  });

  return NextResponse.json(
    { numero: (config?.ultimoNumeroFactura ?? 100) + 1 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
