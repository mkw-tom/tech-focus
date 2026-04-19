import { incidentRepository } from "../../repositories/incident-repository.js"
import { fetchGithubAdvisories } from "./fetch-github-advisories.js"
import { normalizeGithubAdvisory } from "./normalize-github-advisory.js"

export const incidentSyncService = {
  async syncAll() {
    const advisories = await fetchGithubAdvisories()
    const normalizedItems = advisories
      .map((advisory) => normalizeGithubAdvisory(advisory))
      .filter((item) => item !== null)

    const savedItems = await incidentRepository.upsertMany(normalizedItems)

    const byTopic = normalizedItems.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.topic] = (acc[item.topic] ?? 0) + 1
        return acc
      },
      {},
    )

    return {
      fetched: advisories.length,
      matched: normalizedItems.length,
      saved: savedItems.length,
      topics: byTopic,
    }
  },
}
