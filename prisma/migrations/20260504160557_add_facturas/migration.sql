-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "fecha" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "saldoAnterior" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalGeneral" DOUBLE PRECISION NOT NULL,
    "totalPagado" DOUBLE PRECISION NOT NULL,
    "saldoPendiente" DOUBLE PRECISION NOT NULL,
    "cajaDeuda" TEXT NOT NULL DEFAULT '',
    "cajaDejo" TEXT NOT NULL DEFAULT '',
    "cajaRetiro" TEXT NOT NULL DEFAULT '',
    "cajaNuevoSaldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observaciones" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineaFactura" (
    "id" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LineaFactura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoFactura" (
    "id" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "detalle" TEXT NOT NULL DEFAULT '',
    "monto" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PagoFactura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "ultimoNumeroFactura" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numero_key" ON "Factura"("numero");

-- AddForeignKey
ALTER TABLE "LineaFactura" ADD CONSTRAINT "LineaFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoFactura" ADD CONSTRAINT "PagoFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
