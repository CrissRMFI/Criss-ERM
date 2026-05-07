import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();

  const compra = await prisma.compra.findUnique({
    where: { id: params.id },
    include: { pagos: true, lineas: true },
  });

  if (!compra) {
    return NextResponse.json(
      { error: "Compra no encontrada" },
      { status: 404 },
    );
  }

  if (compra.estado === "CANCELADA") {
    return NextResponse.json(
      { error: "La compra está cancelada" },
      { status: 400 },
    );
  }

  // Validar que no se pague de más
  const totalCompra = compra.lineas.reduce(
    (acc, l) => acc + l.cantidadTotal * l.precioCosto,
    0,
  );
  const totalPagado = compra.pagos.reduce((acc, p) => acc + p.monto, 0);
  const restante = totalCompra - totalPagado;

  if (body.monto > restante) {
    return NextResponse.json(
      {
        error: `El monto excede lo adeudado ($${Math.round(restante).toLocaleString("es-AR")})`,
      },
      { status: 400 },
    );
  }

  const pago = await prisma.pagoCompra.create({
    data: {
      compraId: params.id,
      monto: body.monto,
      fecha: body.fecha,
      tipo: body.tipo ?? "Efectivo",
      notas: body.notas ?? "",
    },
  });

  // Si el total pagado ahora es igual al total de la compra, marcarla como COMPLETADA
  const nuevoTotal = totalPagado + body.monto;
  if (nuevoTotal >= totalCompra) {
    await prisma.compra.update({
      where: { id: params.id },
      data: { estado: "COMPLETADA" },
    });
  }

  return NextResponse.json(pago, { status: 201 });
}
