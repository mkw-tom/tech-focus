import { storiesResponseSchema, storyResponseSchema } from "@tech-focus/shared"
import { Hono } from "hono"
import { topStories as snapshotTopStories } from "../data/dashboard-snapshot.js"
import { storyService } from "../services/story-service.js"

export const storyRoutes = new Hono()

storyRoutes.get("/", async (c) => {
  try {
    return c.json(
      storiesResponseSchema.parse({ items: await storyService.listStories() }),
    )
  } catch (error) {
    console.error("Failed to build stories payload", {
      error,
      message: error instanceof Error ? error.message : undefined,
    })

    return c.json(storiesResponseSchema.parse({ items: snapshotTopStories }))
  }
})

storyRoutes.get("/:storyId", async (c) => {
  const storyId = c.req.param("storyId")

  try {
    const story = await storyService.getStoryById(storyId)

    if (story) {
      return c.json(storyResponseSchema.parse({ item: story }))
    }
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

  return c.json(storyResponseSchema.parse({ item: snapshotStory }))
})
