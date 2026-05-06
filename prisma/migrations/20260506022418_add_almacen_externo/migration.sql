-- AlterEnum
ALTER TYPE "AlmacenTipo" ADD VALUE 'EXTERNO';

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "ultimoNumeroMovimiento" INTEGER NOT NULL DEFAULT 0;
