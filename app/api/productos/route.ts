// app/api/productos/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''

  const productos = await prisma.producto.findMany({
    where: q
      ? { nombre: { contains: q, mode: 'insensitive' } }
      : undefined,
    orderBy: { nombre: 'asc' },
  })

  return NextResponse.json(productos)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { nombre, precio } = body

  if (!nombre?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }
  if (typeof precio !== 'number' || precio < 0) {
    return NextResponse.json({ error: 'El precio debe ser un número positivo' }, { status: 400 })
  }

  const producto = await prisma.producto.create({
    data: { nombre: nombre.trim(), precio },
  })

  return NextResponse.json(producto, { status: 201 })
}
