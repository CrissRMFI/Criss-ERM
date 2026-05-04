// app/api/productos/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { nombre, precio } = body

  if (!nombre?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }
  if (typeof precio !== 'number' || precio < 0) {
    return NextResponse.json({ error: 'El precio debe ser un número positivo' }, { status: 400 })
  }

  try {
    const producto = await prisma.producto.update({
      where: { id: params.id },
      data: { nombre: nombre.trim(), precio },
    })
    return NextResponse.json(producto)
  } catch {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.producto.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }
}
