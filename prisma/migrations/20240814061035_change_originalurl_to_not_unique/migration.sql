-- DropIndex
DROP INDEX "Urls_originalUrl_key";

-- AlterTable
ALTER TABLE "Urls" ALTER COLUMN "originalUrl" SET DEFAULT '';
