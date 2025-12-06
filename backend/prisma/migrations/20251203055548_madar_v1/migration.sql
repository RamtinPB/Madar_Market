-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SUB_ADMIN', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
