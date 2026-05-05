import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const almacenes = await prisma.almacen.findMany({
    orderBy: { tipo: "asc" },
  });
  return NextResponse.json(almacenes, {
    headers: { "Cache-Control": "no-store" },
  });
}
