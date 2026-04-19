CREATE TYPE "IncidentSourceType" AS ENUM ('GITHUB_ADVISORY');

CREATE TYPE "IncidentCategory" AS ENUM ('INCIDENT');

CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "technologyId" TEXT,
    "topic" TEXT NOT NULL,
    "sourceType" "IncidentSourceType" NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "packageName" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "category" "IncidentCategory" NOT NULL,
    "importance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Incident_externalId_key" ON "Incident"("externalId");

CREATE INDEX "Incident_technologyId_publishedAt_idx" ON "Incident"("technologyId", "publishedAt");

CREATE INDEX "Incident_topic_publishedAt_idx" ON "Incident"("topic", "publishedAt");

ALTER TABLE "Incident" ADD CONSTRAINT "Incident_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE SET NULL ON UPDATE CASCADE;
