import { IncidentCategory, IncidentSourceType } from "@prisma/client"
import type { PersistedIncident } from "../../repositories/incident-repository.js"
import type { GithubAdvisory } from "./fetch-github-advisories.js"

const incidentTopicMatchers = [
  { topic: "react", technologyId: "react", pattern: "react" },
  { topic: "typescript", technologyId: "typescript", pattern: "typescript" },
  { topic: "next.js", technologyId: "nextjs", pattern: "next" },
  { topic: "hono", technologyId: "hono", pattern: "hono" },
  { topic: "vue", technologyId: "vue", pattern: "vue" },
  { topic: "node", technologyId: undefined, pattern: "node" },
] as const

function inferTopic(advisory: GithubAdvisory) {
  const content =
    `${advisory.summary} ${advisory.description ?? ""}`.toLowerCase()

  return incidentTopicMatchers.find((matcher) =>
    content.includes(matcher.pattern),
  )
}

function computeImportance(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return 5
    case "high":
      return 4
    case "moderate":
      return 3
    case "low":
      return 2
    default:
      return 1
  }
}

function resolveSourceUrl(advisory: GithubAdvisory) {
  return advisory.html_url
}

function resolvePackageName(advisory: GithubAdvisory) {
  return advisory.vulnerabilities.find(
    (item) => item.package.ecosystem.toLowerCase() === "npm",
  )?.package.name
}

export function normalizeGithubAdvisory(
  advisory: GithubAdvisory,
): PersistedIncident | null {
  const matchedTopic = inferTopic(advisory)

  if (!matchedTopic) {
    return null
  }

  return {
    technologyId: matchedTopic.technologyId ?? null,
    topic: matchedTopic.topic,
    sourceType: IncidentSourceType.GITHUB_ADVISORY,
    sourceName: "GitHub Advisory",
    sourceUrl: resolveSourceUrl(advisory),
    externalId: advisory.ghsa_id,
    title: advisory.summary.trim(),
    rawContent: advisory.description?.trim() ?? "",
    severity: advisory.severity.toLowerCase(),
    packageName: resolvePackageName(advisory) ?? null,
    publishedAt: new Date(advisory.published_at),
    category: IncidentCategory.INCIDENT,
    importance: computeImportance(advisory.severity),
  }
}
