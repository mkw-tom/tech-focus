import { serve } from "@hono/node-server"
import { Hono } from "hono"
import {
  briefingPoints as snapshotBriefingPoints,
  marketPulse as snapshotMarketPulse,
  navItems as snapshotNavItems,
  topStories as snapshotTopStories,
  topicFilters as snapshotTopicFilters,
  trackableTechnologies as snapshotTrackableTechnologies,
  watchlistItems as snapshotWatchlistItems,
} from "./data/dashboard-snapshot.js"
import { loadEnv } from "./lib/load-env.js"
import { prisma } from "./lib/prisma.js"

const envName = loadEnv()

const app = new Hono()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function withRetry<T>(operation: () => Promise<T>, retries = 2) {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (attempt === retries) {
        break
      }

      await sleep(250 * (attempt + 1))
    }
  }

  throw lastError
}

const storyKindMap = {
  UPDATE: "アップデート",
  INCIDENT: "インシデント",
  TREND: "トレンド",
} as const

const technologyGroupMap = {
  LANGUAGE: "言語",
  FRAMEWORK: "フレームワーク",
  LIBRARY: "ライブラリ",
  TOOL: "ツール",
} as const

async function getStoriesPayload() {
  const stories = await withRetry(() =>
    prisma.story.findMany({
      include: {
        keyPoints: {
          orderBy: { sortOrder: "asc" },
        },
        relatedLinks: {
          orderBy: { sortOrder: "asc" },
        },
        timeline: {
          orderBy: { sortOrder: "asc" },
        },
        topics: {
          include: {
            technology: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { title: "asc" }],
    }),
  )

  return stories.map((story) => ({
    id: story.id,
    likes_count: story.likesCount,
    kind: storyKindMap[story.kind],
    topicIds: story.topics.map((entry) => entry.technologyId),
    category: story.category,
    title: story.title,
    summary: story.summary,
    source: story.source,
    time: story.timeLabel,
    whyItMatters: story.whyItMatters,
    details: {
      overview: story.overview,
      keyPoints: story.keyPoints.map((entry) => entry.content),
      timeline: story.timeline.map((entry) => entry.content),
      relatedLinks: story.relatedLinks.map((entry) => ({
        label: entry.label,
        url: entry.url,
      })),
    },
  }))
}

async function getStoryPayloadById(storyId: string) {
  const story = await withRetry(() =>
    prisma.story.findUnique({
      where: { id: storyId },
      include: {
        keyPoints: {
          orderBy: { sortOrder: "asc" },
        },
        relatedLinks: {
          orderBy: { sortOrder: "asc" },
        },
        timeline: {
          orderBy: { sortOrder: "asc" },
        },
        topics: {
          include: {
            technology: true,
          },
        },
      },
    }),
  )

  if (!story) {
    return null
  }

  return {
    id: story.id,
    likes_count: story.likesCount,
    kind: storyKindMap[story.kind],
    topicIds: story.topics.map((entry) => entry.technologyId),
    category: story.category,
    title: story.title,
    summary: story.summary,
    source: story.source,
    time: story.timeLabel,
    whyItMatters: story.whyItMatters,
    details: {
      overview: story.overview,
      keyPoints: story.keyPoints.map((entry) => entry.content),
      timeline: story.timeline.map((entry) => entry.content),
      relatedLinks: story.relatedLinks.map((entry) => ({
        label: entry.label,
        url: entry.url,
      })),
    },
  }
}

function getSnapshotDashboardPayload() {
  return {
    navItems: snapshotNavItems,
    topicFilters: snapshotTopicFilters,
    marketPulse: snapshotMarketPulse,
    briefingPoints: snapshotBriefingPoints,
    watchlistItems: snapshotWatchlistItems,
    trackableTechnologies: snapshotTrackableTechnologies,
    topStories: snapshotTopStories,
  }
}

app.get("/", (c) =>
  c.json({
    name: "@tech-focus/api",
    message: "Hono server is running",
    database: `Prisma + Neon is configured via apps/api/.env.${envName}`,
  }),
)

app.get("/health", async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    return c.json({
      ok: true,
      db: "connected",
    })
  } catch (error) {
    console.error("Database health check failed", error)

    return c.json(
      {
        ok: false,
        db: "disconnected",
      },
      500,
    )
  }
})

app.get("/dashboard", async (c) => {
  try {
    const [
      navItems,
      topicFilters,
      dashboardMetrics,
      briefingPoints,
      trackedTechnologies,
      topStories,
    ] = await Promise.all([
      withRetry(() =>
        prisma.navItem.findMany({
          orderBy: { sortOrder: "asc" },
        }),
      ),
      withRetry(() =>
        prisma.topicFilter.findMany({
          orderBy: { sortOrder: "asc" },
        }),
      ),
      withRetry(() =>
        prisma.dashboardMetric.findMany({
          orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
        }),
      ),
      withRetry(() =>
        prisma.briefingPoint.findMany({
          orderBy: { sortOrder: "asc" },
        }),
      ),
      withRetry(() =>
        prisma.technology.findMany({
          orderBy: [{ isTracked: "desc" }, { name: "asc" }],
        }),
      ),
      getStoriesPayload(),
    ])

    return c.json({
      navItems: navItems.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
      })),
      topicFilters: topicFilters.map((item) => ({
        id: item.id,
        label: item.label,
        active: item.isActive,
      })),
      marketPulse: dashboardMetrics
        .filter((item) => item.kind === "MARKET_PULSE")
        .map((item) => ({
          label: item.label,
          value: item.value,
          tone: item.tone,
        })),
      briefingPoints: briefingPoints.map((item) => item.body),
      watchlistItems: dashboardMetrics
        .filter((item) => item.kind === "WATCHLIST")
        .map((item) => ({
          label: item.label,
          value: item.value,
          tone: item.tone,
        })),
      trackableTechnologies: trackedTechnologies.map((item) => ({
        id: item.id,
        name: item.name,
        group: technologyGroupMap[item.group],
        category: item.category,
        description: item.description,
        selected: item.isTracked,
      })),
      topStories,
    })
  } catch (error) {
    console.error("Failed to build dashboard payload", {
      error,
      message: error instanceof Error ? error.message : undefined,
    })
    return c.json(getSnapshotDashboardPayload())
  }
})

app.get("/technologies", async (c) => {
  const technologies = await prisma.technology.findMany({
    orderBy: [{ isTracked: "desc" }, { name: "asc" }],
  })

  return c.json({
    items: technologies.map((item) => ({
      id: item.id,
      name: item.name,
      group: technologyGroupMap[item.group],
      category: item.category,
      description: item.description,
      selected: item.isTracked,
    })),
  })
})

app.get("/stories", async (c) => {
  try {
    const stories = await getStoriesPayload()

    return c.json({ items: stories })
  } catch (error) {
    console.error("Failed to build stories payload", {
      error,
      message: error instanceof Error ? error.message : undefined,
    })

    return c.json({ items: snapshotTopStories })
  }
})

app.get("/stories/:storyId", async (c) => {
  const storyId = c.req.param("storyId")

  try {
    const story = await getStoryPayloadById(storyId)

    if (!story) {
      const snapshotStory = snapshotTopStories.find(
        (item) => item.id === storyId,
      )

      if (!snapshotStory) {
        return c.json({ error: "Story not found" }, 404)
      }

      return c.json({ item: snapshotStory })
    }

    return c.json({ item: story })
  } catch (error) {
    console.error("Failed to build story payload", {
      error,
      message: error instanceof Error ? error.message : undefined,
      storyId,
    })
  }

  const snapshotStory = snapshotTopStories.find((item) => item.id === storyId)

  if (!snapshotStory) {
    return c.json({ error: "Story not found" }, 404)
  }

  return c.json({ item: snapshotStory })
})

const port = 8787

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API server listening on http://localhost:${info.port}`)
  },
)
