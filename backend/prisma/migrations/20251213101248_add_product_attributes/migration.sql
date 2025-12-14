/*
  Warnings:

  - You are about to drop the column `attributes` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "attributes";

-- CreateTable
CREATE TABLE "Attributes" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attributes_productId_idx" ON "Attributes"("productId");

-- AddForeignKey
ALTER TABLE "Attributes" ADD CONSTRAINT "Attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
