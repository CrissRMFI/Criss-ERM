-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "anulada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "anuladaAt" TIMESTAMP(3);
