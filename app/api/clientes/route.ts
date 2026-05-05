import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const soloActivos = searchParams.get("activos") !== "false";

  const clientes = await prisma.cliente.findMany({
    where: {
      activo: soloActivos ? true : undefined,
      nombre: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(clientes, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.nombre?.trim()) {
    return NextResponse.json(
      { error: "El nombre es requerido" },
      { status: 400 },
    );
  }

  const cliente = await prisma.cliente.create({
    data: {
      nombre: body.nombre.trim(),
      telefono: body.telefono?.trim() || null,
      direccion: body.direccion?.trim() || null,
      notas: body.notas?.trim() || null,
    },
  });

  return NextResponse.json(cliente, { status: 201 });
}
