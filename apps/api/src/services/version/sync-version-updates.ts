import {
  getVersionTopicDefinition,
  versionTopicDefinitions,
} from "../../lib/version-topics.js"
import { versionRepository } from "../../repositories/version-repository.js"
import { fetchGithubReleases } from "./fetch-github-releases.js"
import { normalizeGithubRelease } from "./normalize-github-release.js"

export const versionSyncService = {
  async syncAllTopics() {
    const summaries = await Promise.all(
      versionTopicDefinitions.map((definition) =>
        this.syncTopic(definition.topic),
      ),
    )

    return {
      syncedTopics: summaries.length,
      topics: summaries,
    }
  },

  async syncTopic(topic: string) {
    const definition = getVersionTopicDefinition(topic)

    if (!definition) {
      throw new Error(`Unsupported version topic: ${topic}`)
    }

    const releases = await fetchGithubReleases(definition)
    const normalizedItems = releases
      .filter((release) => !release.draft)
      .map((release) => normalizeGithubRelease(definition, release))

    const savedItems = await versionRepository.upsertMany(normalizedItems)

    return {
      fetched: normalizedItems.length,
      saved: savedItems.length,
      topic,
    }
  },
}
