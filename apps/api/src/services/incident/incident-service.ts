import type { IncidentDto, ListFeedQuery } from "@tech-focus/shared"
import { incidentRepository } from "../../repositories/incident-repository.js"

function serializeIncident(
  item: Awaited<ReturnType<typeof incidentRepository.list>>[number],
): IncidentDto {
  return {
    id: item.id,
    topic: item.topic,
    sourceType: "github_advisory",
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    externalId: item.externalId,
    title: item.title,
    rawContent: item.rawContent,
    severity: item.severity,
    packageName: item.packageName,
    publishedAt: item.publishedAt.toISOString(),
    category: "incident",
    importance: item.importance,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export const incidentService = {
  async listIncidents(params?: ListFeedQuery): Promise<IncidentDto[]> {
    const items = await incidentRepository.list(params)

    return items.map(serializeIncident)
  },
}
