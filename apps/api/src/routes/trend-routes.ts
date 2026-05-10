import {
  trendItemsByTechResponseSchema,
  trendItemsQuerySchema,
} from "@tech-focus/shared"
import { Hono } from "hono"
import { trendItemService } from "../services/trend/trend-item-service.js"

export const trendRoutes = new Hono()

trendRoutes.get("/", async (c) => {
  const params = trendItemsQuerySchema.parse(c.req.query())
  const payload = await trendItemService.listTrendItems(params)

  return c.json(trendItemsByTechResponseSchema.parse(payload))
})
