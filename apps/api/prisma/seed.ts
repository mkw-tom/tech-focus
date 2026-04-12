import { PrismaNeon } from "@prisma/adapter-neon"
import {
  DashboardMetricKind,
  PrismaClient,
  StoryKind,
  TechnologyGroup,
} from "@prisma/client"
import * as dashboard from "../src/data/dashboard-snapshot.js"
import { loadEnv } from "../src/lib/load-env.js"

loadEnv()

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL is required to seed the Neon database.",
  )
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString,
  }),
})

const storyKindMap: Record<
  (typeof dashboard.topStories)[number]["kind"],
  StoryKind
> = {
  アップデート: StoryKind.UPDATE,
  インシデント: StoryKind.INCIDENT,
  トレンド: StoryKind.TREND,
}

const technologyGroupMap: Record<
  (typeof dashboard.trackableTechnologies)[number]["group"],
  TechnologyGroup
> = {
  言語: TechnologyGroup.LANGUAGE,
  フレームワーク: TechnologyGroup.FRAMEWORK,
  ライブラリ: TechnologyGroup.LIBRARY,
  ツール: TechnologyGroup.TOOL,
}

async function main() {
  for (const [index, item] of dashboard.navItems.entries()) {
    await prisma.navItem.upsert({
      where: { id: item.id },
      update: {
        label: item.label,
        href: item.href,
        sortOrder: index,
      },
      create: {
        id: item.id,
        label: item.label,
        href: item.href,
        sortOrder: index,
      },
    })
  }

  for (const [index, item] of dashboard.topicFilters.entries()) {
    await prisma.topicFilter.upsert({
      where: { id: item.id },
      update: {
        label: item.label,
        isActive: item.active ?? false,
        sortOrder: index,
      },
      create: {
        id: item.id,
        label: item.label,
        isActive: item.active ?? false,
        sortOrder: index,
      },
    })
  }

  for (const [index, item] of dashboard.marketPulse.entries()) {
    await prisma.dashboardMetric.upsert({
      where: { id: `market-pulse-${index}` },
      update: {
        kind: DashboardMetricKind.MARKET_PULSE,
        label: item.label,
        value: item.value,
        tone: item.tone,
        sortOrder: index,
      },
      create: {
        id: `market-pulse-${index}`,
        kind: DashboardMetricKind.MARKET_PULSE,
        label: item.label,
        value: item.value,
        tone: item.tone,
        sortOrder: index,
      },
    })
  }

  for (const [index, item] of dashboard.watchlistItems.entries()) {
    await prisma.dashboardMetric.upsert({
      where: { id: `watchlist-${index}` },
      update: {
        kind: DashboardMetricKind.WATCHLIST,
        label: item.label,
        value: item.value,
        tone: item.tone,
        sortOrder: index,
      },
      create: {
        id: `watchlist-${index}`,
        kind: DashboardMetricKind.WATCHLIST,
        label: item.label,
        value: item.value,
        tone: item.tone,
        sortOrder: index,
      },
    })
  }

  for (const [index, item] of dashboard.briefingPoints.entries()) {
    await prisma.briefingPoint.upsert({
      where: { id: `briefing-point-${index}` },
      update: {
        body: item,
        sortOrder: index,
      },
      create: {
        id: `briefing-point-${index}`,
        body: item,
        sortOrder: index,
      },
    })
  }

  for (const technology of dashboard.trackableTechnologies) {
    await prisma.technology.upsert({
      where: { id: technology.id },
      update: {
        name: technology.name,
        group: technologyGroupMap[technology.group],
        category: technology.category,
        description: technology.description,
        isTracked: technology.selected ?? false,
      },
      create: {
        id: technology.id,
        name: technology.name,
        group: technologyGroupMap[technology.group],
        category: technology.category,
        description: technology.description,
        isTracked: technology.selected ?? false,
      },
    })
  }

  for (const story of dashboard.topStories) {
    await prisma.story.upsert({
      where: { id: story.id },
      update: {
        kind: storyKindMap[story.kind],
        category: story.category,
        title: story.title,
        summary: story.summary,
        source: story.source,
        timeLabel: story.time,
        whyItMatters: story.whyItMatters,
        overview: story.details.overview,
        likesCount: story.likes_count,
      },
      create: {
        id: story.id,
        kind: storyKindMap[story.kind],
        category: story.category,
        title: story.title,
        summary: story.summary,
        source: story.source,
        timeLabel: story.time,
        whyItMatters: story.whyItMatters,
        overview: story.details.overview,
        likesCount: story.likes_count,
      },
    })

    await prisma.storyKeyPoint.deleteMany({
      where: { storyId: story.id },
    })

    await prisma.storyKeyPoint.createMany({
      data: story.details.keyPoints.map((content, index) => ({
        id: `${story.id}-key-point-${index}`,
        storyId: story.id,
        content,
        sortOrder: index,
      })),
    })

    await prisma.storyTimelineEntry.deleteMany({
      where: { storyId: story.id },
    })

    await prisma.storyTimelineEntry.createMany({
      data: story.details.timeline.map((content, index) => ({
        id: `${story.id}-timeline-${index}`,
        storyId: story.id,
        content,
        sortOrder: index,
      })),
    })

    await prisma.storyRelatedLink.deleteMany({
      where: { storyId: story.id },
    })

    await prisma.storyRelatedLink.createMany({
      data: story.details.relatedLinks.map((link, index) => ({
        id: `${story.id}-related-link-${index}`,
        storyId: story.id,
        label: link.label,
        url: link.url,
        sortOrder: index,
      })),
    })

    await prisma.storyTopic.deleteMany({
      where: { storyId: story.id },
    })

    await prisma.storyTopic.createMany({
      data: story.topicIds.map((topicId) => ({
        storyId: story.id,
        technologyId: topicId,
      })),
      skipDuplicates: true,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error("Failed to seed database", error)
    await prisma.$disconnect()
    process.exit(1)
  })
