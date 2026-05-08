import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } },
) {
  await prisma.notificacion.update({
    where: { id: params.id },
    data: { leida: true },
  });
  return NextResponse.json({ ok: true });
}
