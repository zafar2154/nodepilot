/*
  Warnings:

  - A unique constraint covering the columns `[vPin]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vPin` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "vPin" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device_vPin_key" ON "Device"("vPin");
