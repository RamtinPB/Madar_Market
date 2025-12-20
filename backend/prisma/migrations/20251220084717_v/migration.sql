/*
  Warnings:

  - The primary key for the `Attributes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `Attributes` table. All the data in the column will be lost.
  - The `id` column on the `Attributes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `Category` table. All the data in the column will be lost.
  - The `id` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `Product` table. All the data in the column will be lost.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `ProductImage` table. All the data in the column will be lost.
  - The `id` column on the `ProductImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `SubCategory` table. All the data in the column will be lost.
  - The `id` column on the `SubCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `businessId` was added to the `Attributes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `productId` on the `Attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `businessId` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `businessId` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `subCategoryId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `businessId` was added to the `ProductImage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `productId` on the `ProductImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `businessId` was added to the `SubCategory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `categoryId` on the `SubCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Attributes" DROP CONSTRAINT "Attributes_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Attributes" DROP CONSTRAINT "Attributes_pkey",
DROP COLUMN "order",
ADD COLUMN     "businessId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "Attributes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "order",
ADD COLUMN     "businessId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "order",
ADD COLUMN     "businessId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "subCategoryId",
ADD COLUMN     "subCategoryId" INTEGER NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
DROP COLUMN "order",
ADD COLUMN     "businessId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_pkey",
DROP COLUMN "order",
ADD COLUMN     "businessId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Attributes_productId_idx" ON "Attributes"("productId");

-- CreateIndex
CREATE INDEX "Product_subCategoryId_idx" ON "Product"("subCategoryId");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attributes" ADD CONSTRAINT "Attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
