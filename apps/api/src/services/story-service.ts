import type { StoryDto } from "@tech-focus/shared"
import { storyRepository } from "../repositories/story-repository.js"

const storyKindMap = {
  UPDATE: "アップデート",
  INCIDENT: "インシデント",
  TREND: "トレンド",
} as const

function toStoryPayload(
  story: Awaited<ReturnType<typeof storyRepository.findById>>,
): StoryDto | null {
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

export const storyService = {
  async getStoryById(storyId: string): Promise<StoryDto | null> {
    const story = await storyRepository.findById(storyId)
    return toStoryPayload(story)
  },

  async listStories(): Promise<StoryDto[]> {
    const stories = await storyRepository.findMany()
    return stories
      .map((story) => toStoryPayload(story))
      .filter((story): story is StoryDto => story !== null)
  },
}
