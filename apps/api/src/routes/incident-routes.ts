import { Hono } from "hono"
import { z } from "zod"
import { incidentService } from "../services/incident/incident-service.js"
import { incidentSyncService } from "../services/incident/sync-incident-updates.js"

const incidentsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  topic: z.string().trim().min(1).optional(),
})

export const incidentRoutes = new Hono()

incidentRoutes.get("/", async (c) => {
  const params = incidentsQuerySchema.parse(c.req.query())
  const items = await incidentService.listIncidents(params)

  return c.json({
    items,
  })
})

incidentRoutes.post("/sync", async (c) => {
  return c.json(await incidentSyncService.syncAll())
})
