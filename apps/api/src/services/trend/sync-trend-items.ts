import { TrendItemSource } from "@prisma/client"
import {
  type TrendItemDto,
  type TrendSyncSourceResult,
  type TrendSyncSummary,
  type TrendTech,
  trendSyncSummarySchema,
} from "@tech-focus/shared"
import {
  getTrendTopicDefinition,
  trendTopicDefinitions,
} from "../../lib/trend-topics.js"
import {
  type PersistedTrendItem,
  trendItemRepository,
} from "../../repositories/trend-item-repository.js"
import { githubTrendFetcher } from "./github-trend-fetcher.js"
import { hnTrendFetcher } from "./hn-trend-fetcher.js"

type SourceName = TrendItemDto["source"]

type FetchSuccess = {
  source: SourceName
  tech: string
  items: TrendItemDto[]
}

type FetchFailure = {
  source: SourceName
  tech: string
  error: string
}

function toPersistedTrendItem(item: TrendItemDto): PersistedTrendItem {
  const definition = getTrendTopicDefinition(item.tech)

  if (!definition) {
    throw new Error(`Unsupported trend topic: ${item.tech}`)
  }

  return {
    technologyId: definition.technologyId,
    tech: item.tech,
    source:
      item.source === "hn"
        ? TrendItemSource.HN
        : item.source === "github"
          ? TrendItemSource.GITHUB
          : TrendItemSource.QIITA,
    title: item.title,
    url: item.url,
    publishedAt: new Date(item.publishedAt),
    score: item.score,
    author: item.author ?? null,
    summary: item.summary ?? null,
    rawText: item.rawText ?? null,
    externalId: item.externalId,
    fetchedAt: new Date(item.fetchedAt),
  }
}

function dedupeTrendItems(items: TrendItemDto[]) {
  const seenExternalKeys = new Set<string>()
  const seenUrlKeys = new Set<string>()
  const deduped: TrendItemDto[] = []

  for (const item of items) {
    const externalKey = `${item.source}:${item.externalId}`
    const urlKey = `${item.source}:${item.url}`

    if (seenExternalKeys.has(externalKey) || seenUrlKeys.has(urlKey)) {
      continue
    }

    seenExternalKeys.add(externalKey)
    seenUrlKeys.add(urlKey)
    deduped.push(item)
  }

  return deduped
}

async function runFetcher(
  source: SourceName,
  tech: string,
  fetcher: () => Promise<TrendItemDto[]>,
): Promise<FetchSuccess | FetchFailure> {
  try {
    const items = await fetcher()
    return { source, tech, items }
  } catch (error) {
    return {
      source,
      tech,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function buildResults(
  fetchResults: Array<FetchSuccess | FetchFailure>,
  savedItems: TrendItemDto[],
): TrendSyncSourceResult[] {
  return fetchResults.map((result) => {
    if ("error" in result) {
      return {
        source: result.source,
        tech: result.tech,
        fetched: 0,
        saved: 0,
        error: result.error,
      }
    }

    const saved = savedItems.filter(
      (item) => item.source === result.source && item.tech === result.tech,
    ).length

    return {
      source: result.source,
      tech: result.tech,
      fetched: result.items.length,
      saved,
    }
  })
}

async function syncTopics(techs: string[]): Promise<TrendSyncSummary> {
  const definitions = techs.map((tech) => {
    const definition = getTrendTopicDefinition(tech as TrendTech)

    if (!definition) {
      throw new Error(`Unsupported trend topic: ${tech}`)
    }

    return definition
  })

  const fetchResults = await Promise.all(
    definitions.flatMap((definition) => [
      runFetcher("hn", definition.tech, () => hnTrendFetcher.fetch(definition)),
      runFetcher("github", definition.tech, () =>
        githubTrendFetcher.fetch(definition),
      ),
    ]),
  )

  const fetchedItems = fetchResults.flatMap((result) =>
    "items" in result ? result.items : [],
  )
  const dedupedItems = dedupeTrendItems(fetchedItems)
  const savedItems =
    dedupedItems.length > 0
      ? await trendItemRepository.upsertMany(
          dedupedItems.map(toPersistedTrendItem),
        )
      : []

  return trendSyncSummarySchema.parse({
    fetched: fetchedItems.length,
    deduped: dedupedItems.length,
    saved: savedItems.length,
    results: buildResults(fetchResults, savedItems),
    failedSources: fetchResults
      .filter((result): result is FetchFailure => "error" in result)
      .map((result) => ({
        source: result.source,
        tech: result.tech as TrendTech,
        error: result.error,
      })),
  })
}

export const trendSyncService = {
  async syncAll(): Promise<TrendSyncSummary> {
    return syncTopics(trendTopicDefinitions.map((item) => item.tech))
  },

  async syncTech(tech: TrendTech): Promise<TrendSyncSummary> {
    return syncTopics([tech])
  },
}
