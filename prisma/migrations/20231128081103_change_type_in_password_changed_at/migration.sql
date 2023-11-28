/*
  Warnings:

  - The `passwordChangedAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `passwordResetExpires` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordChangedAt",
ADD COLUMN     "passwordChangedAt" INTEGER,
DROP COLUMN "passwordResetExpires",
ADD COLUMN     "passwordResetExpires" INTEGER;
