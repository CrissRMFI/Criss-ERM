/*
  Warnings:

  - You are about to drop the column `proveedor` on the `Compra` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompraEstado" AS ENUM ('PENDIENTE', 'COMPLETADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "proveedor",
ADD COLUMN     "canceladaAt" TIMESTAMP(3),
ADD COLUMN     "estado" "CompraEstado" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "proveedorId" TEXT;

-- CreateTable
CREATE TABLE "PagoCompra" (
    "id" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Efectivo',
    "notas" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PagoCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PagoCompra" ADD CONSTRAINT "PagoCompra_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
