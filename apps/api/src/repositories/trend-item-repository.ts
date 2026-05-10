import { TrendItemSource } from "@prisma/client"
import type {
  TrendItemDto,
  TrendListSource,
  TrendTech,
} from "@tech-focus/shared"
import { prisma } from "../lib/prisma.js"

export type PersistedTrendItem = {
  technologyId?: string | null
  tech: string
  source: TrendItemSource
  title: string
  url: string
  publishedAt: Date
  score: number
  author?: string | null
  summary?: string | null
  rawText?: string | null
  externalId: string
  fetchedAt: Date
}

function toTrendItemDto(
  item: Awaited<ReturnType<typeof prisma.trendItem.findFirstOrThrow>>,
): TrendItemDto {
  return {
    id: item.id,
    source: item.source.toLowerCase() as TrendItemDto["source"],
    tech: item.tech as TrendTech,
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt.toISOString(),
    score: item.score,
    author: item.author ?? undefined,
    summary: item.summary ?? undefined,
    rawText: item.rawText ?? undefined,
    externalId: item.externalId,
    fetchedAt: item.fetchedAt.toISOString(),
  }
}

export const trendItemRepository = {
  async list(params: {
    tech: TrendTech
    source?: TrendListSource
    limit?: number
  }): Promise<TrendItemDto[]> {
    const items = await prisma.trendItem.findMany({
      where: {
        tech: params.tech,
        source: params.source
          ? params.source === "hn"
            ? TrendItemSource.HN
            : TrendItemSource.GITHUB
          : {
              in: [TrendItemSource.HN, TrendItemSource.GITHUB],
            },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: params.limit,
    })

    return items.map(toTrendItemDto)
  },

  async upsertMany(items: PersistedTrendItem[]): Promise<TrendItemDto[]> {
    const results = []

    for (const item of items) {
      const existing = await prisma.trendItem.findFirst({
        where: {
          source: item.source,
          OR: [{ externalId: item.externalId }, { url: item.url }],
        },
      })

      if (existing) {
        results.push(
          await prisma.trendItem.update({
            where: { id: existing.id },
            data: {
              technologyId: item.technologyId ?? null,
              tech: item.tech,
              title: item.title,
              url: item.url,
              publishedAt: item.publishedAt,
              score: item.score,
              author: item.author ?? null,
              summary: item.summary ?? null,
              rawText: item.rawText ?? null,
              externalId: item.externalId,
              fetchedAt: item.fetchedAt,
            },
          }),
        )

        continue
      }

      results.push(
        await prisma.trendItem.create({
          data: {
            technologyId: item.technologyId ?? null,
            tech: item.tech,
            source: item.source,
            title: item.title,
            url: item.url,
            publishedAt: item.publishedAt,
            score: item.score,
            author: item.author ?? null,
            summary: item.summary ?? null,
            rawText: item.rawText ?? null,
            externalId: item.externalId,
            fetchedAt: item.fetchedAt,
          },
        }),
      )
    }

    return results.map(toTrendItemDto)
  },
}
