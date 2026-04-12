import { loadEnv } from "../lib/load-env.js"
import { prisma } from "../lib/prisma.js"
import { versionSyncService } from "../services/version/sync-version-updates.js"

async function main() {
  loadEnv()

  const summary = await versionSyncService.syncAllTopics()

  console.log(
    JSON.stringify(
      {
        job: "sync-version-updates",
        ...summary,
      },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error("Failed to sync version updates", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
