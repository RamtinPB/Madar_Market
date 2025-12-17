/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `ProductImage` table. All the data in the column will be lost.
  - Made the column `title` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "imagePath",
ADD COLUMN     "imageKey" TEXT,
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "path",
ADD COLUMN     "key" TEXT;
