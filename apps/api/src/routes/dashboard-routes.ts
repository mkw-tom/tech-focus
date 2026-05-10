import {
  dashboardDataDtoSchema,
  technologiesResponseSchema,
} from "@tech-focus/shared"
import { Hono } from "hono"
import {
  dashboardService,
  getSnapshotDashboardPayload,
} from "../services/dashboard-service.js"

export const dashboardRoutes = new Hono()

dashboardRoutes.get("/", async (c) => {
  try {
    return c.json(
      dashboardDataDtoSchema.parse(
        await dashboardService.getDashboardPayload(),
      ),
    )
  } catch (error) {
    console.error("Failed to build dashboard payload", {
      error,
      message: error instanceof Error ? error.message : undefined,
    })

    return c.json(dashboardDataDtoSchema.parse(getSnapshotDashboardPayload()))
  }
})

dashboardRoutes.get("/technologies", async (c) => {
  return c.json(
    technologiesResponseSchema.parse({
      items: await dashboardService.listTechnologies(),
    }),
  )
})
