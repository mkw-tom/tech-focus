import type { TrendItemDto } from "@tech-focus/shared"
import { z } from "zod"
import type { TrendTopicDefinition } from "../../lib/trend-topics.js"

const githubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  updated_at: z.string().datetime(),
  owner: z.object({
    login: z.string(),
  }),
})

const githubSearchResponseSchema = z.object({
  items: z.array(githubRepositorySchema),
})

function getGithubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tech-focus-api",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

function normalizeGithubRepository(
  repository: z.infer<typeof githubRepositorySchema>,
  topic: TrendTopicDefinition,
  fetchedAt: string,
): TrendItemDto {
  return {
    id: `github:${repository.id}`,
    source: "github",
    tech: topic.tech,
    title: repository.full_name,
    url: repository.html_url,
    publishedAt: new Date(repository.updated_at).toISOString(),
    score: repository.stargazers_count,
    author: repository.owner.login,
    summary: repository.description ?? undefined,
    rawText: repository.description ?? undefined,
    externalId: String(repository.id),
    fetchedAt,
  }
}

export const githubTrendFetcher = {
  async fetch(topic: TrendTopicDefinition): Promise<TrendItemDto[]> {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(topic.githubQuery)}&sort=updated&order=desc&per_page=5`,
      {
        headers: getGithubHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(
        `GitHub trend fetch failed for tech=${topic.tech}: ${response.status}`,
      )
    }

    const payload = githubSearchResponseSchema.parse(await response.json())
    const fetchedAt = new Date().toISOString()

    return payload.items
      .map((item) => normalizeGithubRepository(item, topic, fetchedAt))
      .slice(0, 5)
  },
}
