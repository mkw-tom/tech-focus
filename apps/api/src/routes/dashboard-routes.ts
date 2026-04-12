import { Hono } from "hono"
import {
  dashboardService,
  getSnapshotDashboardPayload,
} from "../services/dashboard-service.js"

export const dashboardRoutes = new Hono()

dashboardRoutes.get("/", async (c) => {
  try {
    return c.json(await dashboardService.getDashboardPayload())
  } catch (error) {
    console.error("Failed to build dashboard payload", {
      error,
      message: error instanceof Error ? error.message : undefined,
    })

    return c.json(getSnapshotDashboardPayload())
  }
})

dashboardRoutes.get("/technologies", async (c) => {
  return c.json({
    items: await dashboardService.listTechnologies(),
  })
})
