import path from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const apiRoot = path.resolve(currentDir, "../..")

export function loadEnv() {
  const envName =
    process.env.NODE_ENV === "production" ? "production" : "development"

  config({
    path: path.join(apiRoot, ".env"),
    override: false,
  })

  config({
    path: path.join(apiRoot, `.env.${envName}`),
    override: true,
  })

  return envName
}
