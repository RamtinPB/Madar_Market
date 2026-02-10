/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountedPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessId` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `ProductImage` table. All the data in the column will be lost.
  - The primary key for the `SubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessId` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the `Attributes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `subCategoryId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `publicId` was added to the `ProductImage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `productId` on the `ProductImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `publicId` was added to the `SubCategory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `categoryId` on the `SubCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'ENUM', 'DATE');

-- DropForeignKey
ALTER TABLE "Attributes" DROP CONSTRAINT "Attributes_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "businessId",
DROP COLUMN "order",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "businessId",
DROP COLUMN "discountedPrice",
DROP COLUMN "order",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
DROP COLUMN "subCategoryId",
ADD COLUMN     "subCategoryId" INTEGER NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
DROP COLUMN "businessId",
DROP COLUMN "order",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_pkey",
DROP COLUMN "businessId",
DROP COLUMN "order",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Attributes";

-- CreateTable
CREATE TABLE "AttributeDefinition" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT,
    "type" "AttributeType" NOT NULL,
    "unit" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "attributeDefinitionId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeDefinition_publicId_key" ON "AttributeDefinition"("publicId");

-- CreateIndex
CREATE INDEX "AttributeDefinition_publicId_idx" ON "AttributeDefinition"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeDefinition_name_unit_key" ON "AttributeDefinition"("name", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_publicId_key" ON "ProductAttribute"("publicId");

-- CreateIndex
CREATE INDEX "ProductAttribute_publicId_idx" ON "ProductAttribute"("publicId");

-- CreateIndex
CREATE INDEX "ProductAttribute_productId_idx" ON "ProductAttribute"("productId");

-- CreateIndex
CREATE INDEX "ProductAttribute_attributeDefinitionId_idx" ON "ProductAttribute"("attributeDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_productId_attributeDefinitionId_key" ON "ProductAttribute"("productId", "attributeDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_publicId_key" ON "Category"("publicId");

-- CreateIndex
CREATE INDEX "Category_publicId_idx" ON "Category"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_publicId_key" ON "Product"("publicId");

-- CreateIndex
CREATE INDEX "Product_publicId_idx" ON "Product"("publicId");

-- CreateIndex
CREATE INDEX "Product_subCategoryId_idx" ON "Product"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_publicId_key" ON "ProductImage"("publicId");

-- CreateIndex
CREATE INDEX "ProductImage_publicId_idx" ON "ProductImage"("publicId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_publicId_key" ON "SubCategory"("publicId");

-- CreateIndex
CREATE INDEX "SubCategory_publicId_idx" ON "SubCategory"("publicId");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_attributeDefinitionId_fkey" FOREIGN KEY ("attributeDefinitionId") REFERENCES "AttributeDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
