-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RevokedAccessToken" (
    "id" SERIAL NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevokedAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevokedAccessToken_tokenHash_key" ON "RevokedAccessToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RevokedAccessToken_tokenHash_idx" ON "RevokedAccessToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RevokedAccessToken_userId_idx" ON "RevokedAccessToken"("userId");

-- AddForeignKey
ALTER TABLE "RevokedAccessToken" ADD CONSTRAINT "RevokedAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
