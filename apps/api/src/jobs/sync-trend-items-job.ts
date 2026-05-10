import { loadEnv } from "../lib/load-env.js"
import { prisma } from "../lib/prisma.js"
import { trendSyncService } from "../services/trend/sync-trend-items.js"

export async function runTrendSyncJob() {
  loadEnv()
  return trendSyncService.syncAll()
}

async function main() {
  const summary = await runTrendSyncJob()

  console.log(
    JSON.stringify(
      {
        job: "sync-trend-items",
        ...summary,
      },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error("Failed to sync trend items", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
