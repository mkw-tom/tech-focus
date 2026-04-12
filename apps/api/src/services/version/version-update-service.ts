import { versionRepository } from "../../repositories/version-repository.js"

export const versionUpdateService = {
  async listVersionUpdates(params?: { limit?: number; topic?: string }) {
    const items = await versionRepository.list(params)

    return items.map((item) => ({
      id: item.id,
      topic: item.topic,
      sourceType: item.sourceType.toLowerCase(),
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      externalId: item.externalId,
      title: item.title,
      version: item.version,
      rawContent: item.rawContent,
      publishedAt: item.publishedAt,
      category: item.category.toLowerCase(),
      importance: item.importance,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  },
}
