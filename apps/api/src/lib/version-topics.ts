export type VersionTopicDefinition = {
  owner: string
  repo: string
  sourceName: string
  sourceUrl: string
  technologyId?: string
  topic: string
}

export const versionTopicDefinitions: VersionTopicDefinition[] = [
  {
    topic: "react",
    technologyId: "react",
    owner: "facebook",
    repo: "react",
    sourceName: "GitHub Releases",
    sourceUrl: "https://github.com/facebook/react/releases",
  },
  {
    topic: "typescript",
    technologyId: "typescript",
    owner: "microsoft",
    repo: "TypeScript",
    sourceName: "GitHub Releases",
    sourceUrl: "https://github.com/microsoft/TypeScript/releases",
  },
  {
    topic: "next.js",
    technologyId: "nextjs",
    owner: "vercel",
    repo: "next.js",
    sourceName: "GitHub Releases",
    sourceUrl: "https://github.com/vercel/next.js/releases",
  },
  {
    topic: "hono",
    technologyId: "hono",
    owner: "honojs",
    repo: "hono",
    sourceName: "GitHub Releases",
    sourceUrl: "https://github.com/honojs/hono/releases",
  },
  {
    topic: "vue",
    technologyId: "vue",
    owner: "vuejs",
    repo: "core",
    sourceName: "GitHub Releases",
    sourceUrl: "https://github.com/vuejs/core/releases",
  },
  {
    topic: "node",
    owner: "nodejs",
    repo: "node",
    sourceName: "GitHub Releases",
    sourceUrl: "https://github.com/nodejs/node/releases",
  },
]

export function getVersionTopicDefinition(topic: string) {
  return versionTopicDefinitions.find((item) => item.topic === topic)
}
