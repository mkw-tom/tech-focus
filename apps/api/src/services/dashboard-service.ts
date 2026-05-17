import type {
  DashboardDataDto,
  TrackableTechnologyDto,
} from "@tech-focus/shared"
import {
  briefingPoints as snapshotBriefingPoints,
  marketPulse as snapshotMarketPulse,
  navItems as snapshotNavItems,
  topStories as snapshotTopStories,
  topicFilters as snapshotTopicFilters,
  trackableTechnologies as snapshotTrackableTechnologies,
  watchlistItems as snapshotWatchlistItems,
} from "../data/dashboard-snapshot.js"
import { dashboardRepository } from "../repositories/dashboard-repository.js"
import { storyService } from "./story-service.js"

const technologyGroupMap = {
  LANGUAGE: "言語",
  FRAMEWORK: "フレームワーク",
  LIBRARY: "ライブラリ",
  TOOL: "ツール",
} as const

export function getSnapshotDashboardPayload(): DashboardDataDto {
  return {
    navItems: snapshotNavItems,
    topicFilters: snapshotTopicFilters.filter((item) => item.id !== "trend"),
    marketPulse: snapshotMarketPulse,
    briefingPoints: snapshotBriefingPoints,
    watchlistItems: snapshotWatchlistItems,
    trackableTechnologies: snapshotTrackableTechnologies,
    topStories: snapshotTopStories,
  }
}

export const dashboardService = {
  async getDashboardPayload(): Promise<DashboardDataDto> {
    const [
      navItems,
      topicFilters,
      dashboardMetrics,
      briefingPoints,
      trackedTechnologies,
      topStories,
    ] = await Promise.all([
      dashboardRepository.findNavItems(),
      dashboardRepository.findTopicFilters(),
      dashboardRepository.findDashboardMetrics(),
      dashboardRepository.findBriefingPoints(),
      dashboardRepository.findTechnologies(),
      storyService.listStories(),
    ])

    return {
      navItems: navItems.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
      })),
      topicFilters: topicFilters
        .filter((item) => item.id !== "trend")
        .map((item) => ({
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
      topStories: topStories.filter((story) => story.kind !== "トレンド"),
    }
  },

  async listTechnologies(): Promise<TrackableTechnologyDto[]> {
    const technologies = await dashboardRepository.findTechnologies()

    return technologies.map((item) => ({
      id: item.id,
      name: item.name,
      group: technologyGroupMap[item.group],
      category: item.category,
      description: item.description,
      selected: item.isTracked,
    }))
  },
}
