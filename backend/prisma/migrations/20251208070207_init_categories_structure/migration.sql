/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountPct` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `SubCategory` table. All the data in the column will be lost.
  - Made the column `order` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Category_order_idx";

-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "Product_slug_key";

-- DropIndex
DROP INDEX "Product_subCategoryId_title_idx";

-- DropIndex
DROP INDEX "ProductImage_productId_order_idx";

-- DropIndex
DROP INDEX "SubCategory_categoryId_order_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "slug",
ALTER COLUMN "order" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "discountPct",
DROP COLUMN "slug",
ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "slug";

-- CreateIndex
CREATE INDEX "Product_subCategoryId_idx" ON "Product"("subCategoryId");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");
