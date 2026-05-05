/*
  Warnings:

  - You are about to drop the column `cliente` on the `Factura` table. All the data in the column will be lost.
  - Added the required column `clienteNombre` to the `Factura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "cliente",
ADD COLUMN     "clienteId" TEXT,
ADD COLUMN     "clienteNombre" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
