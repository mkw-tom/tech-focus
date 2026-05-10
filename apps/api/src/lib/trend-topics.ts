import type { TrendTech } from "@tech-focus/shared"

export type TrendTopicDefinition = {
  tech: TrendTech
  technologyId: string
  hnQuery: string
  githubQuery: string
  qiitaQuery: string
}

export const trendTopicDefinitions: TrendTopicDefinition[] = [
  {
    tech: "react",
    technologyId: "react",
    hnQuery: "React",
    githubQuery: "react in:name,description,readme",
    qiitaQuery: "React",
  },
  {
    tech: "typescript",
    technologyId: "typescript",
    hnQuery: "TypeScript",
    githubQuery: "typescript in:name,description,readme",
    qiitaQuery: "TypeScript",
  },
  {
    tech: "hono",
    technologyId: "hono",
    hnQuery: "Hono",
    githubQuery: "hono in:name,description,readme",
    qiitaQuery: "Hono",
  },
]

export function getTrendTopicDefinition(tech: TrendTech) {
  return trendTopicDefinitions.find((item) => item.tech === tech)
}
