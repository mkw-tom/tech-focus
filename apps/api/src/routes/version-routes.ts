import {
  listFeedQuerySchema,
  versionSyncAllSummarySchema,
  versionSyncRequestSchema,
  versionSyncTopicSummarySchema,
  versionUpdatesResponseSchema,
} from "@tech-focus/shared"
import { Hono } from "hono"
import { versionSyncService } from "../services/version/sync-version-updates.js"
import { versionUpdateService } from "../services/version/version-update-service.js"

export const versionRoutes = new Hono()

versionRoutes.get("/", async (c) => {
  const params = listFeedQuerySchema.parse(c.req.query())
  const items = await versionUpdateService.listVersionUpdates(params)

  return c.json(
    versionUpdatesResponseSchema.parse({
      items,
    }),
  )
})

versionRoutes.post("/sync", async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const payload = versionSyncRequestSchema.parse(body)

  if (payload.topic) {
    return c.json(
      versionSyncTopicSummarySchema.parse(
        await versionSyncService.syncTopic(payload.topic),
      ),
    )
  }

  return c.json(
    versionSyncAllSummarySchema.parse(await versionSyncService.syncAllTopics()),
  )
})
