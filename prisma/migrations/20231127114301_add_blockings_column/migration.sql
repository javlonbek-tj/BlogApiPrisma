-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockingId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_blockingId_fkey" FOREIGN KEY ("blockingId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
