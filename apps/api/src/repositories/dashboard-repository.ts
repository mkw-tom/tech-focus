import { withRetry } from "../lib/async.js"
import { prisma } from "../lib/prisma.js"

export const dashboardRepository = {
  findBriefingPoints() {
    return withRetry(() =>
      prisma.briefingPoint.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    )
  },

  findDashboardMetrics() {
    return withRetry(() =>
      prisma.dashboardMetric.findMany({
        orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
      }),
    )
  },

  findNavItems() {
    return withRetry(() =>
      prisma.navItem.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    )
  },

  findTechnologies() {
    return withRetry(() =>
      prisma.technology.findMany({
        orderBy: [{ isTracked: "desc" }, { name: "asc" }],
      }),
    )
  },

  findTopicFilters() {
    return withRetry(() =>
      prisma.topicFilter.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    )
  },
}
