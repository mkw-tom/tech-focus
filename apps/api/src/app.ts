import { Hono } from "hono"
import { cors } from "hono/cors"
import { loadEnv } from "./lib/load-env.js"
import { aiDigestRoutes } from "./routes/ai-digest-routes.js"
import { dashboardRoutes } from "./routes/dashboard-routes.js"
import { healthRoutes } from "./routes/health-routes.js"
import { incidentRoutes } from "./routes/incident-routes.js"
import { storyRoutes } from "./routes/story-routes.js"
import { versionRoutes } from "./routes/version-routes.js"
// import { trendRoutes } from "./routes/trend-routes.js"

const envName = loadEnv()

export function createApp() {
  const app = new Hono()

  app.use("*", cors())

  app.get("/", (c) =>
    c.json({
      name: "@tech-focus/api",
      message: "Hono server is running",
      database: `Prisma + Neon is configured via apps/api/.env.${envName}`,
    }),
  )

  app.route("/health", healthRoutes)
  app.route("/ai-digests", aiDigestRoutes)
  app.route("/dashboard", dashboardRoutes)
  app.route("/incidents", incidentRoutes)
  app.route("/stories", storyRoutes)
  // Trend detection is on hold because technology-only trend extraction proved
  // too noisy to operate reliably. Keep the route code for future revisit.
  // app.route("/trends", trendRoutes)
  app.route("/version-updates", versionRoutes)

  return app
}
