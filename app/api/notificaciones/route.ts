import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const notificaciones = await prisma.notificacion.findMany({
    where: { leida: false },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notificaciones);
}
