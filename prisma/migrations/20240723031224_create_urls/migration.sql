-- CreateTable
CREATE TABLE "Urls" (
    "id" SERIAL NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortenUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Urls_originalUrl_key" ON "Urls"("originalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Urls_shortenUrl_key" ON "Urls"("shortenUrl");
