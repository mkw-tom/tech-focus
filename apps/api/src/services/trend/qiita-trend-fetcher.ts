import type { TrendItemDto } from "@tech-focus/shared"
import { z } from "zod"
import type { TrendTopicDefinition } from "../../lib/trend-topics.js"

const qiitaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  created_at: z.string().datetime({ offset: true }),
  likes_count: z.number(),
  body: z.string(),
  tags: z.array(
    z.object({
      name: z.string(),
    }),
  ),
  user: z.object({
    id: z.string(),
  }),
})

const qiitaItemsSchema = z.array(qiitaItemSchema)

function getQiitaHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "tech-focus-api",
  }

  if (process.env.QIITA_TOKEN) {
    headers.Authorization = `Bearer ${process.env.QIITA_TOKEN}`
  }

  return headers
}

function normalizeQiitaItem(
  item: z.infer<typeof qiitaItemSchema>,
  topic: TrendTopicDefinition,
  fetchedAt: string,
): TrendItemDto {
  return {
    id: `qiita:${item.id}`,
    source: "qiita",
    tech: topic.tech,
    title: item.title,
    url: item.url,
    publishedAt: new Date(item.created_at).toISOString(),
    score: item.likes_count,
    author: item.user.id,
    rawText: item.body,
    externalId: item.id,
    fetchedAt,
  }
}

export const qiitaTrendFetcher = {
  async fetch(topic: TrendTopicDefinition): Promise<TrendItemDto[]> {
    const response = await fetch(
      "https://qiita.com/api/v2/items?page=1&per_page=5",
      {
        headers: getQiitaHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(
        `Qiita trend fetch failed for tech=${topic.tech}: ${response.status}`,
      )
    }

    const payload = qiitaItemsSchema.parse(await response.json())
    const fetchedAt = new Date().toISOString()

    return payload
      .map((item) => normalizeQiitaItem(item, topic, fetchedAt))
      .slice(0, 5)
  },
}
