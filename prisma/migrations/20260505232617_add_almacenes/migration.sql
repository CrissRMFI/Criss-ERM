-- CreateEnum
CREATE TYPE "AlmacenTipo" AS ENUM ('CENTRAL', 'MOVIL');

-- CreateTable
CREATE TABLE "Almacen" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "AlmacenTipo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL DEFAULT '',
    "observaciones" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompraLinea" (
    "id" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidadTotal" INTEGER NOT NULL,
    "cantidadRetirada" INTEGER NOT NULL DEFAULT 0,
    "precioCosto" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CompraLinea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockLote" (
    "id" TEXT NOT NULL,
    "almacenId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioCosto" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockLote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traslado" (
    "id" TEXT NOT NULL,
    "origenId" TEXT NOT NULL,
    "destinoId" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Traslado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrasladoLinea" (
    "id" TEXT NOT NULL,
    "trasladoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioCosto" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TrasladoLinea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompraLinea" ADD CONSTRAINT "CompraLinea_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraLinea" ADD CONSTRAINT "CompraLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLote" ADD CONSTRAINT "StockLote_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLote" ADD CONSTRAINT "StockLote_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_origenId_fkey" FOREIGN KEY ("origenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladoLinea" ADD CONSTRAINT "TrasladoLinea_trasladoId_fkey" FOREIGN KEY ("trasladoId") REFERENCES "Traslado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladoLinea" ADD CONSTRAINT "TrasladoLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
