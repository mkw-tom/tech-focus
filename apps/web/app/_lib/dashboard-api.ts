import "server-only"

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

import type {
  NavItem,
  Story,
  Topic,
  TrackableTechnology,
  TrendMetric,
  WatchlistItem,
} from "../_data/dashboard"

export type DashboardData = {
  navItems: NavItem[]
  topicFilters: Topic[]
  marketPulse: TrendMetric[]
  briefingPoints: string[]
  watchlistItems: WatchlistItem[]
  trackableTechnologies: TrackableTechnology[]
  topStories: Story[]
}

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

async function apiFetch<T>(path: string): Promise<T> {
  let lastStatus: number | undefined
  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      })

      if (response.ok) {
        return response.json() as Promise<T>
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
    return await apiFetch<DashboardData>("/dashboard")
  } catch (error) {
    logApiFallback("/dashboard", error)
    return fallbackDashboardData
  }
}

export async function getStories(): Promise<Story[]> {
  try {
    const response = await apiFetch<{ items: Story[] }>("/stories")
    return response.items
  } catch (error) {
    logApiFallback("/stories", error)
    return fallbackTopStories
  }
}

export async function getStoryById(storyId: string): Promise<Story> {
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

    const payload = (await response.json()) as { item: Story }
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

export function searchStories(stories: Story[], query: string) {
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
