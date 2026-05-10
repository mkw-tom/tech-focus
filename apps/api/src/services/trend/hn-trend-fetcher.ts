import type { TrendItemDto } from "@tech-focus/shared"
import { z } from "zod"
import type { TrendTopicDefinition } from "../../lib/trend-topics.js"

const hnHitSchema = z.object({
  objectID: z.string(),
  title: z.string().nullable().optional(),
  story_title: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  story_url: z.string().url().nullable().optional(),
  author: z.string().nullable().optional(),
  points: z.number().nullable().optional(),
  created_at: z.string().datetime(),
  comment_text: z.string().nullable().optional(),
  story_text: z.string().nullable().optional(),
})

const hnSearchResponseSchema = z.object({
  hits: z.array(hnHitSchema),
})

function normalizeHnHit(
  hit: z.infer<typeof hnHitSchema>,
  topic: TrendTopicDefinition,
  fetchedAt: string,
): TrendItemDto | null {
  const title = hit.title ?? hit.story_title ?? null
  const url = hit.url ?? hit.story_url ?? null

  if (!title || !url) {
    return null
  }

  return {
    id: `hn:${hit.objectID}`,
    source: "hn",
    tech: topic.tech,
    title,
    url,
    publishedAt: new Date(hit.created_at).toISOString(),
    score: hit.points ?? 0,
    author: hit.author ?? undefined,
    rawText: hit.story_text ?? hit.comment_text ?? undefined,
    externalId: hit.objectID,
    fetchedAt,
  }
}

export const hnTrendFetcher = {
  async fetch(topic: TrendTopicDefinition): Promise<TrendItemDto[]> {
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(topic.hnQuery)}&hitsPerPage=5`,
    )

    if (!response.ok) {
      throw new Error(
        `HN trend fetch failed for tech=${topic.tech}: ${response.status}`,
      )
    }

    const payload = hnSearchResponseSchema.parse(await response.json())
    const fetchedAt = new Date().toISOString()

    return payload.hits
      .map((hit) => normalizeHnHit(hit, topic, fetchedAt))
      .filter((item): item is TrendItemDto => item !== null)
      .slice(0, 5)
  },
}
