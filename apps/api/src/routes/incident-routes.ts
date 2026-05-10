import {
  incidentSyncSummarySchema,
  incidentsResponseSchema,
  listFeedQuerySchema,
} from "@tech-focus/shared"
import { Hono } from "hono"
import { incidentService } from "../services/incident/incident-service.js"
import { incidentSyncService } from "../services/incident/sync-incident-updates.js"

export const incidentRoutes = new Hono()

incidentRoutes.get("/", async (c) => {
  const params = listFeedQuerySchema.parse(c.req.query())
  const items = await incidentService.listIncidents(params)

  return c.json(
    incidentsResponseSchema.parse({
      items,
    }),
  )
})

incidentRoutes.post("/sync", async (c) => {
  return c.json(
    incidentSyncSummarySchema.parse(await incidentSyncService.syncAll()),
  )
})
