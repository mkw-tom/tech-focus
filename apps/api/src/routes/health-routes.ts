import { Hono } from "hono"
import { prisma } from "../lib/prisma.js"

export const healthRoutes = new Hono()

healthRoutes.get("/", async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    return c.json({
      ok: true,
      db: "connected",
    })
  } catch (error) {
    console.error("Database health check failed", error)

    return c.json(
      {
        ok: false,
        db: "disconnected",
      },
      500,
    )
  }
})
