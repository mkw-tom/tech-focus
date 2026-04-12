-- CreateEnum
CREATE TYPE "VersionUpdateSourceType" AS ENUM ('GITHUB_RELEASE');

-- CreateEnum
CREATE TYPE "VersionUpdateCategory" AS ENUM ('UPDATE');

-- CreateTable
CREATE TABLE "VersionUpdate" (
    "id" TEXT NOT NULL,
    "technologyId" TEXT,
    "topic" TEXT NOT NULL,
    "sourceType" "VersionUpdateSourceType" NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "category" "VersionUpdateCategory" NOT NULL,
    "importance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VersionUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VersionUpdate_externalId_key" ON "VersionUpdate"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "VersionUpdate_topic_version_sourceType_key" ON "VersionUpdate"("topic", "version", "sourceType");

-- CreateIndex
CREATE INDEX "VersionUpdate_technologyId_publishedAt_idx" ON "VersionUpdate"("technologyId", "publishedAt");

-- CreateIndex
CREATE INDEX "VersionUpdate_topic_publishedAt_idx" ON "VersionUpdate"("topic", "publishedAt");

-- AddForeignKey
ALTER TABLE "VersionUpdate" ADD CONSTRAINT "VersionUpdate_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE SET NULL ON UPDATE CASCADE;
