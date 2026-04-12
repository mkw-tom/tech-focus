import path from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"
import { defineConfig, env } from "prisma/config"

const currentDir = path.dirname(fileURLToPath(import.meta.url))

config({
  path: path.join(currentDir, ".env"),
  override: false,
})

config({
  path: path.join(
    currentDir,
    `.env.${process.env.NODE_ENV === "production" ? "production" : "development"}`,
  ),
  override: true,
})

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
})
