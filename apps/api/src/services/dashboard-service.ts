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

export function getSnapshotDashboardPayload() {
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

export const dashboardService = {
  async getDashboardPayload() {
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
    }
  },

  async listTechnologies() {
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
