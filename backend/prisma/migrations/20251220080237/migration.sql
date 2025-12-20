/*
  Warnings:

  - You are about to drop the column `compressionRatio` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `isOptimized` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailKeys` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `ProductImage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductImage_hash_idx";

-- DropIndex
DROP INDEX "ProductImage_isPrimary_idx";

-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "compressionRatio",
DROP COLUMN "fileName",
DROP COLUMN "fileSize",
DROP COLUMN "format",
DROP COLUMN "hash",
DROP COLUMN "height",
DROP COLUMN "isOptimized",
DROP COLUMN "isPrimary",
DROP COLUMN "mimeType",
DROP COLUMN "originalName",
DROP COLUMN "thumbnailKeys",
DROP COLUMN "updatedAt",
DROP COLUMN "width";
