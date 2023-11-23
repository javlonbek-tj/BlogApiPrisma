-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_postDislikeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_postLikeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_postViewerId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "postViewerId" DROP NOT NULL,
ALTER COLUMN "postLikeId" DROP NOT NULL,
ALTER COLUMN "postDislikeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_postViewerId_fkey" FOREIGN KEY ("postViewerId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_postLikeId_fkey" FOREIGN KEY ("postLikeId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_postDislikeId_fkey" FOREIGN KEY ("postDislikeId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
