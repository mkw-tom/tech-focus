import { VersionUpdateCategory, VersionUpdateSourceType } from "@prisma/client"
import type { VersionTopicDefinition } from "../../lib/version-topics.js"
import type { PersistedVersionUpdate } from "../../repositories/version-repository.js"
import type { GithubRelease } from "./fetch-github-releases.js"

function normalizeVersion(tagName: string) {
  return tagName.trim()
}

function computeImportance(release: GithubRelease) {
  const content =
    `${release.tag_name} ${release.name ?? ""} ${release.body ?? ""}`.toLowerCase()

  if (release.prerelease) {
    return 1
  }

  if (content.includes("security") || content.includes("breaking")) {
    return 5
  }

  if (/v?\d+\.\d+\.\d+/.test(release.tag_name)) {
    return 3
  }

  return 2
}

export function normalizeGithubRelease(
  topicDefinition: VersionTopicDefinition,
  release: GithubRelease,
): PersistedVersionUpdate {
  const version = normalizeVersion(release.tag_name)
  const title = release.name?.trim() || `${topicDefinition.topic} ${version}`

  return {
    technologyId: topicDefinition.technologyId,
    topic: topicDefinition.topic,
    sourceType: VersionUpdateSourceType.GITHUB_RELEASE,
    sourceName: topicDefinition.sourceName,
    sourceUrl: release.html_url,
    externalId: `github-release:${topicDefinition.owner}/${topicDefinition.repo}:${release.id}`,
    title,
    version,
    rawContent: release.body?.trim() || "",
    publishedAt: new Date(release.published_at),
    category: VersionUpdateCategory.UPDATE,
    importance: computeImportance(release),
  }
}
