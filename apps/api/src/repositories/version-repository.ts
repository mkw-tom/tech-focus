import type {
  VersionUpdateCategory,
  VersionUpdateSourceType,
} from "@prisma/client"
import { prisma } from "../lib/prisma.js"

export type PersistedVersionUpdate = {
  technologyId?: string | null
  topic: string
  sourceType: VersionUpdateSourceType
  sourceName: string
  sourceUrl: string
  externalId: string
  title: string
  version: string
  rawContent: string
  publishedAt: Date
  category: VersionUpdateCategory
  importance: number
}

export const versionRepository = {
  async findById(id: string) {
    return prisma.versionUpdate.findUnique({
      where: { id },
    })
  },

  async list(params?: { limit?: number; topic?: string }) {
    const items = await prisma.versionUpdate.findMany({
      where: params?.topic ? { topic: params.topic } : undefined,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: params?.limit,
    })

    return items
  },

  async upsertMany(items: PersistedVersionUpdate[]) {
    const results = await Promise.all(
      items.map((item) =>
        prisma.versionUpdate.upsert({
          where: { externalId: item.externalId },
          update: {
            category: item.category,
            importance: item.importance,
            publishedAt: item.publishedAt,
            rawContent: item.rawContent,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            sourceUrl: item.sourceUrl,
            technologyId: item.technologyId,
            title: item.title,
            topic: item.topic,
            version: item.version,
          },
          create: {
            category: item.category,
            importance: item.importance,
            publishedAt: item.publishedAt,
            rawContent: item.rawContent,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            sourceUrl: item.sourceUrl,
            externalId: item.externalId,
            technologyId: item.technologyId ?? null,
            title: item.title,
            topic: item.topic,
            version: item.version,
          },
        }),
      ),
    )

    return results
  },
}
