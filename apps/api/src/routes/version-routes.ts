import { Hono } from "hono"
import { z } from "zod"
import { versionSyncService } from "../services/version/sync-version-updates.js"
import { versionUpdateService } from "../services/version/version-update-service.js"

const versionUpdatesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  topic: z.string().trim().min(1).optional(),
})

export const versionRoutes = new Hono()

versionRoutes.get("/", async (c) => {
  const params = versionUpdatesQuerySchema.parse(c.req.query())
  const items = await versionUpdateService.listVersionUpdates(params)

  return c.json({
    items,
  })
})

versionRoutes.post("/sync", async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const payload = z.object({ topic: z.string().optional() }).parse(body)

  if (payload.topic) {
    return c.json(await versionSyncService.syncTopic(payload.topic))
  }

  return c.json(await versionSyncService.syncAllTopics())
})
