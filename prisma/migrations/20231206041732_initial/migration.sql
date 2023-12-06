-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordResetExpires" SET DATA TYPE BIGINT,
ALTER COLUMN "activationCodeExpires" SET DATA TYPE BIGINT;
