import { z } from "zod"
import type { VersionTopicDefinition } from "../../lib/version-topics.js"

const githubReleaseSchema = z.object({
  id: z.number(),
  html_url: z.string().url(),
  tag_name: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  published_at: z.string().datetime(),
  draft: z.boolean(),
  prerelease: z.boolean(),
})

const githubReleasesSchema = z.array(githubReleaseSchema)

export type GithubRelease = z.infer<typeof githubReleaseSchema>

function getGithubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tech-focus-api",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

export async function fetchGithubReleases(
  topicDefinition: Pick<VersionTopicDefinition, "owner" | "repo">,
) {
  const response = await fetch(
    `https://api.github.com/repos/${topicDefinition.owner}/${topicDefinition.repo}/releases?per_page=10`,
    {
      headers: getGithubHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error(
      `GitHub releases fetch failed for ${topicDefinition.owner}/${topicDefinition.repo}: ${response.status}`,
    )
  }

  const payload = await response.json()
  return githubReleasesSchema.parse(payload)
}
