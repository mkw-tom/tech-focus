import { incidentRepository } from "../../repositories/incident-repository.js"

export const incidentService = {
  async listIncidents(params?: { limit?: number; topic?: string }) {
    const items = await incidentRepository.list(params)

    return items.map((item) => ({
      id: item.id,
      topic: item.topic,
      sourceType: item.sourceType.toLowerCase(),
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      externalId: item.externalId,
      title: item.title,
      rawContent: item.rawContent,
      severity: item.severity,
      packageName: item.packageName,
      publishedAt: item.publishedAt,
      category: item.category.toLowerCase(),
      importance: item.importance,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  },
}
