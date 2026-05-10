CREATE TYPE "TrendItemSource" AS ENUM ('HN', 'GITHUB', 'QIITA');

CREATE TABLE "TrendItem" (
    "id" TEXT NOT NULL,
    "technologyId" TEXT,
    "tech" TEXT NOT NULL,
    "source" "TrendItemSource" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "author" TEXT,
    "summary" TEXT,
    "rawText" TEXT,
    "externalId" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrendItem_source_externalId_key" ON "TrendItem"("source", "externalId");
CREATE UNIQUE INDEX "TrendItem_source_url_key" ON "TrendItem"("source", "url");
CREATE INDEX "TrendItem_technologyId_publishedAt_idx" ON "TrendItem"("technologyId", "publishedAt");
CREATE INDEX "TrendItem_tech_publishedAt_idx" ON "TrendItem"("tech", "publishedAt");
CREATE INDEX "TrendItem_source_publishedAt_idx" ON "TrendItem"("source", "publishedAt");

ALTER TABLE "TrendItem" ADD CONSTRAINT "TrendItem_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE SET NULL ON UPDATE CASCADE;
