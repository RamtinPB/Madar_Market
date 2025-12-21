-- AlterTable
ALTER TABLE "Attributes" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" ADD COLUMN     "order" SERIAL NOT NULL;
