import { z } from "zod"

const githubAdvisorySchema = z.object({
  ghsa_id: z.string(),
  summary: z.string(),
  description: z.string().nullable(),
  severity: z.string(),
  published_at: z.string().datetime(),
  html_url: z.string().url(),
  vulnerabilities: z
    .array(
      z.object({
        package: z.object({
          ecosystem: z.string(),
          name: z.string(),
        }),
      }),
    )
    .optional()
    .default([]),
})

const githubAdvisoriesSchema = z.array(githubAdvisorySchema)

export type GithubAdvisory = z.infer<typeof githubAdvisorySchema>
const advisorySeverities = ["high", "critical"] as const

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

async function fetchBySeverity(severity: (typeof advisorySeverities)[number]) {
  const response = await fetch(
    `https://api.github.com/advisories?ecosystem=npm&severity=${severity}&per_page=20&type=reviewed`,
    {
      headers: getGithubHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error(
      `GitHub advisories fetch failed for severity=${severity}: ${response.status}`,
    )
  }

  const payload = await response.json()
  return githubAdvisoriesSchema.parse(payload)
}

export async function fetchGithubAdvisories() {
  const results = await Promise.all(
    advisorySeverities.map((severity) => fetchBySeverity(severity)),
  )

  const advisories = results.flat()
  const uniqueByGhsaId = new Map(
    advisories.map((advisory) => [advisory.ghsa_id, advisory]),
  )

  return Array.from(uniqueByGhsaId.values())
}
