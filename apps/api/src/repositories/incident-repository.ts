import type { IncidentCategory, IncidentSourceType } from "@prisma/client"
import { prisma } from "../lib/prisma.js"

export type PersistedIncident = {
  technologyId?: string | null
  topic: string
  sourceType: IncidentSourceType
  sourceName: string
  sourceUrl: string
  externalId: string
  title: string
  rawContent: string
  severity: string
  packageName?: string | null
  publishedAt: Date
  category: IncidentCategory
  importance: number
}

export const incidentRepository = {
  async findById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
    })
  },

  async list(params?: { limit?: number; topic?: string }) {
    return prisma.incident.findMany({
      where: params?.topic ? { topic: params.topic } : undefined,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: params?.limit,
    })
  },

  async upsertMany(items: PersistedIncident[]) {
    return Promise.all(
      items.map((item) =>
        prisma.incident.upsert({
          where: { externalId: item.externalId },
          update: {
            category: item.category,
            importance: item.importance,
            packageName: item.packageName ?? null,
            publishedAt: item.publishedAt,
            rawContent: item.rawContent,
            severity: item.severity,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            sourceUrl: item.sourceUrl,
            technologyId: item.technologyId ?? null,
            title: item.title,
            topic: item.topic,
          },
          create: {
            category: item.category,
            importance: item.importance,
            packageName: item.packageName ?? null,
            publishedAt: item.publishedAt,
            rawContent: item.rawContent,
            severity: item.severity,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            sourceUrl: item.sourceUrl,
            externalId: item.externalId,
            technologyId: item.technologyId ?? null,
            title: item.title,
            topic: item.topic,
          },
        }),
      ),
    )
  },
}
