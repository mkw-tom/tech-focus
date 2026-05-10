import "server-only"

import {
  type DashboardDataDto,
  type IncidentDto,
  type StoryDto,
  type TrendItemDto,
  type VersionUpdateDto,
  dashboardDataDtoSchema,
  incidentsResponseSchema,
  storiesResponseSchema,
  storyResponseSchema,
  trendItemsByTechResponseSchema,
  trendTechValues,
  versionUpdatesResponseSchema,
} from "@tech-focus/shared"
import { notFound } from "next/navigation"
import {
  type Story as FallbackStory,
  briefingPoints as fallbackBriefingPoints,
  marketPulse as fallbackMarketPulse,
  navItems as fallbackNavItems,
  topStories as fallbackTopStories,
  topicFilters as fallbackTopicFilters,
  trackableTechnologies as fallbackTrackableTechnologies,
  watchlistItems as fallbackWatchlistItems,
} from "../_data/dashboard"

export type DashboardData = DashboardDataDto

const apiBaseUrl =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8787"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const fallbackDashboardData: DashboardData = {
  navItems: fallbackNavItems,
  topicFilters: fallbackTopicFilters,
  marketPulse: fallbackMarketPulse,
  briefingPoints: fallbackBriefingPoints,
  watchlistItems: fallbackWatchlistItems,
  trackableTechnologies: fallbackTrackableTechnologies,
  topStories: fallbackTopStories,
}

function logApiFallback(path: string, error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    error.digest === "DYNAMIC_SERVER_USAGE"
  ) {
    return
  }

  console.warn(`Falling back to local dashboard data for ${path}`, error)
}

async function apiFetch<T>(
  path: string,
  schema: { parse: (input: unknown) => T },
): Promise<T> {
  let lastStatus: number | undefined
  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      })

      if (response.ok) {
        return schema.parse(await response.json())
      }

      lastStatus = response.status

      if (response.status < 500 || attempt === 2) {
        throw new Error(`Failed to fetch ${path}: ${response.status}`)
      }
    } catch (error) {
      lastError = error

      if (attempt === 2) {
        break
      }

      await sleep(300 * (attempt + 1))
    }
  }

  if (lastStatus) {
    throw new Error(`Failed to fetch ${path}: ${lastStatus}`)
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch ${path}`)
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    return await apiFetch("/dashboard", dashboardDataDtoSchema)
  } catch (error) {
    logApiFallback("/dashboard", error)
    return fallbackDashboardData
  }
}

export async function getStories(): Promise<StoryDto[]> {
  try {
    const response = await apiFetch("/stories", storiesResponseSchema)
    return response.items
  } catch (error) {
    logApiFallback("/stories", error)
    return fallbackTopStories
  }
}

export async function getVersionUpdates(
  topicIds?: string[],
): Promise<VersionUpdateDto[]> {
  const params = new URLSearchParams()

  if (topicIds?.length === 1) {
    params.set("topic", topicIds[0])
  }

  params.set("limit", "30")

  try {
    const response = await apiFetch(
      `/version-updates?${params.toString()}`,
      versionUpdatesResponseSchema,
    )

    return response.items
  } catch (error) {
    logApiFallback("/version-updates", error)
    return []
  }
}

export async function getIncidents(
  topicIds?: string[],
): Promise<IncidentDto[]> {
  const params = new URLSearchParams()

  if (topicIds?.length === 1) {
    params.set("topic", topicIds[0])
  }

  params.set("limit", "30")

  try {
    const response = await apiFetch(
      `/incidents?${params.toString()}`,
      incidentsResponseSchema,
    )

    return response.items
  } catch (error) {
    logApiFallback("/incidents", error)
    return []
  }
}

export async function getTrends(topicIds?: string[]): Promise<TrendItemDto[]> {
  const supportedTopics = (
    topicIds?.length ? topicIds : trendTechValues
  ).filter((topicId): topicId is (typeof trendTechValues)[number] =>
    trendTechValues.includes(topicId as (typeof trendTechValues)[number]),
  )

  if (supportedTopics.length === 0) {
    return []
  }

  try {
    const responses = await Promise.all(
      supportedTopics.map((tech) =>
        apiFetch(
          `/trends?${new URLSearchParams({ tech, limit: "20" }).toString()}`,
          trendItemsByTechResponseSchema,
        ),
      ),
    )

    return responses
      .flatMap((response) => response.items)
      .sort(
        (left, right) =>
          new Date(right.publishedAt).getTime() -
          new Date(left.publishedAt).getTime(),
      )
  } catch (error) {
    logApiFallback("/trends", error)
    return []
  }
}

export async function getStoryById(storyId: string): Promise<StoryDto> {
  try {
    const response = await fetch(`${apiBaseUrl}/stories/${storyId}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })

    if (response.status === 404) {
      notFound()
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch story ${storyId}: ${response.status}`)
    }

    const payload = storyResponseSchema.parse(await response.json())
    return payload.item
  } catch (error) {
    logApiFallback(`/stories/${storyId}`, error)

    const fallbackStory = fallbackTopStories.find(
      (story): story is FallbackStory => story.id === storyId,
    )

    if (!fallbackStory) {
      notFound()
    }

    return fallbackStory
  }
}

export function searchStories(stories: StoryDto[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return []
  }

  return stories.filter((story) =>
    [
      story.title,
      story.summary,
      story.category,
      story.kind,
      story.whyItMatters,
      story.details.overview,
      ...story.details.keyPoints,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  )
}
