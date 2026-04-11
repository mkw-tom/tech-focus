import { serve } from "@hono/node-server"
import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) =>
  c.json({
    name: "@tech-focus/api",
    message: "Hono server is running",
  }),
)

app.get("/health", (c) => c.json({ ok: true }))

const port = 8787

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API server listening on http://localhost:${info.port}`)
  },
)
