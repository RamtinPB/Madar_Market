/*
  Warnings:

  - Added the required column `phoneNumber` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "phoneNumber" TEXT NOT NULL;
