import type { ListFeedQuery, VersionUpdateDto } from "@tech-focus/shared"
import { versionRepository } from "../../repositories/version-repository.js"

export const versionUpdateService = {
  async listVersionUpdates(
    params?: ListFeedQuery,
  ): Promise<VersionUpdateDto[]> {
    const items = await versionRepository.list(params)

    return items.map((item) => ({
      id: item.id,
      topic: item.topic,
      sourceType: "github_release",
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      externalId: item.externalId,
      title: item.title,
      version: item.version,
      rawContent: item.rawContent,
      publishedAt: item.publishedAt.toISOString(),
      category: "update",
      importance: item.importance,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  },
}
