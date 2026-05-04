/*
  Warnings:

  - The `cajaDeuda` column on the `Factura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cajaDejo` column on the `Factura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cajaRetiro` column on the `Factura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `cajaNuevoSaldo` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "cajaDeuda",
ADD COLUMN     "cajaDeuda" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "cajaDejo",
ADD COLUMN     "cajaDejo" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "cajaRetiro",
ADD COLUMN     "cajaRetiro" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "cajaNuevoSaldo" SET DEFAULT 0,
ALTER COLUMN "cajaNuevoSaldo" SET DATA TYPE INTEGER;
