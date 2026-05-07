import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const proveedores = await prisma.proveedor.findMany({
    orderBy: { nombre: "asc" },
  });
  return NextResponse.json(proveedores, {
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
  const proveedor = await prisma.proveedor.create({
    data: {
      nombre: body.nombre.trim(),
      telefono: body.telefono?.trim() || null,
      notas: body.notas?.trim() || null,
    },
  });
  return NextResponse.json(proveedor, { status: 201 });
}
