/*
  Warnings:

  - A unique constraint covering the columns `[numeroMovimiento]` on the table `Traslado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numeroMovimiento` to the `Traslado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Traslado" ADD COLUMN     "numeroMovimiento" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Traslado_numeroMovimiento_key" ON "Traslado"("numeroMovimiento");
