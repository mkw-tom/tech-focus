import { withRetry } from "../lib/async.js"
import { prisma } from "../lib/prisma.js"

const storyInclude = {
  keyPoints: {
    orderBy: { sortOrder: "asc" as const },
  },
  relatedLinks: {
    orderBy: { sortOrder: "asc" as const },
  },
  timeline: {
    orderBy: { sortOrder: "asc" as const },
  },
  topics: {
    include: {
      technology: true,
    },
  },
}

export const storyRepository = {
  findMany() {
    return withRetry(() =>
      prisma.story.findMany({
        include: storyInclude,
        orderBy: [{ createdAt: "desc" }, { title: "asc" }],
      }),
    )
  },

  findById(storyId: string) {
    return withRetry(() =>
      prisma.story.findUnique({
        where: { id: storyId },
        include: storyInclude,
      }),
    )
  },
}
