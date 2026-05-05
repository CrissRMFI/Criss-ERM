import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  if (!body.nombre?.trim()) {
    return NextResponse.json(
      { error: "El nombre es requerido" },
      { status: 400 },
    );
  }

  const cliente = await prisma.cliente.update({
    where: { id: params.id },
    data: {
      nombre: body.nombre.trim(),
      telefono: body.telefono?.trim() || null,
      direccion: body.direccion?.trim() || null,
      notas: body.notas?.trim() || null,
    },
  });

  return NextResponse.json(cliente);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const cliente = await prisma.cliente.update({
    where: { id: params.id },
    data: { activo: body.activo },
  });
  return NextResponse.json(cliente);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
    });
    if (!cliente)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(cliente);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
