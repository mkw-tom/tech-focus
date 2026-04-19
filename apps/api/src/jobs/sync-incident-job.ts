import { loadEnv } from "../lib/load-env.js"
import { prisma } from "../lib/prisma.js"
import { incidentSyncService } from "../services/incident/sync-incident-updates.js"

async function main() {
  loadEnv()

  const summary = await incidentSyncService.syncAll()

  console.log(
    JSON.stringify(
      {
        job: "sync-incidents",
        ...summary,
      },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error("Failed to sync incidents", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
