import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clienteId = searchParams.get("clienteId");
  const verAnuladas = searchParams.get("anuladas") === "true";

  const facturas = await prisma.factura.findMany({
    where: {
      ...(clienteId ? { clienteId } : {}),
      ...(!verAnuladas ? { anulada: false } : {}),
    },
    include: { lineas: true, pagos: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(facturas, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const ALMACEN_MOVIL = "almacen-movil";

  // Validar stock para cada línea
  const lineasConProducto = (body.lineas ?? []).filter((l: any) => l.nombre);

  if (lineasConProducto.length > 0) {
    const errores: {
      nombre: string;
      disponible: number;
      solicitado: number;
    }[] = [];

    for (const linea of lineasConProducto) {
      // Buscar producto por nombre
      const producto = await prisma.producto.findFirst({
        where: { nombre: linea.nombre },
      });

      if (!producto) continue;

      // Sumar stock disponible en depósito móvil
      const lotes = await prisma.stockLote.findMany({
        where: {
          almacenId: ALMACEN_MOVIL,
          productoId: producto.id,
          cantidad: { gt: 0 },
        },
      });
      const disponible = lotes.reduce((acc, l) => acc + l.cantidad, 0);

      if (disponible < linea.qty) {
        errores.push({
          nombre: linea.nombre,
          disponible,
          solicitado: linea.qty,
        });
      }
    }

    if (errores.length > 0) {
      return NextResponse.json({ errores }, { status: 422 });
    }
  }

  // Transacción: crear factura + descontar stock FIFO + crear notificación
  const factura = await prisma.$transaction(async (tx) => {
    const config = await tx.config.update({
      where: { id: "singleton" },
      data: { ultimoNumeroFactura: { increment: 1 } },
    });

    // Crear factura
    const nuevaFactura = await tx.factura.create({
      data: {
        numero: config.ultimoNumeroFactura,
        fecha: body.fecha,
        clienteId: body.clienteId ?? null,
        clienteNombre: body.clienteNombre ?? "",
        subtotal: body.subtotal,
        saldoAnterior: body.saldoAnterior ?? 0,
        totalGeneral: body.totalGeneral,
        totalPagado: body.totalPagado,
        saldoPendiente: body.saldoPendiente,
        cajaDeuda: Math.floor(parseInt(body.cajaDeuda) || 0),
        cajaDejo: Math.floor(parseInt(body.cajaDejo) || 0),
        cajaRetiro: Math.floor(parseInt(body.cajaRetiro) || 0),
        cajaNuevoSaldo: Math.floor(parseInt(body.cajaNuevoSaldo) || 0),
        observaciones: body.observaciones ?? "",
        lineas: {
          create: body.lineas.map((l: any) => ({
            nombre: l.nombre,
            qty: l.qty,
            precio: l.precio,
            subtotal: l.qty * l.precio,
          })),
        },
        pagos: {
          create: body.pagos.map((p: any) => ({
            tipo: p.tipo,
            detalle: p.detalle ?? "",
            monto: p.monto,
          })),
        },
      },
      include: { lineas: true, pagos: true },
    });

    // Descontar stock FIFO por cada línea
    for (const linea of lineasConProducto) {
      const producto = await tx.producto.findFirst({
        where: { nombre: linea.nombre },
      });
      if (!producto) continue;

      const lotes = await tx.stockLote.findMany({
        where: {
          almacenId: ALMACEN_MOVIL,
          productoId: producto.id,
          cantidad: { gt: 0 },
        },
        orderBy: { createdAt: "asc" }, // FIFO
      });

      let aDescontar = linea.qty;
      for (const lote of lotes) {
        if (aDescontar <= 0) break;
        const descuento = Math.min(lote.cantidad, aDescontar);
        await tx.stockLote.update({
          where: { id: lote.id },
          data: { cantidad: { decrement: descuento } },
        });
        aDescontar -= descuento;
      }
    }

    // Crear notificación de utilidad pendiente
    if (lineasConProducto.length > 0) {
      await tx.notificacion.create({
        data: {
          tipo: "UTILIDAD_PENDIENTE",
          mensaje: `Factura #${config.ultimoNumeroFactura} — ${body.clienteNombre} — pendiente de costeo`,
          url: `/utilidades/${nuevaFactura.id}`,
        },
      });
    }

    return nuevaFactura;
  });

  return NextResponse.json(factura, {
    headers: { "Cache-Control": "no-store" },
    status: 201,
  });
}
