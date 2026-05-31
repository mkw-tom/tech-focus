import { z } from "zod"

const isoDateTimeSchema = z.string().datetime({ offset: true })
export const trendTechValues = ["react", "typescript", "hono"] as const
export const trendSourceValues = ["hn", "github", "qiita"] as const
export const trendTechSchema = z.enum(trendTechValues)
export const trendSourceSchema = z.enum(trendSourceValues)
export const trendListSourceSchema = z.enum(["hn", "github"])

export const topicDtoSchema = z.object({
  id: z.string(),
  label: z.string(),
  active: z.boolean().optional(),
})

export const navItemDtoSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
})

export const trendMetricDtoSchema = z.object({
  label: z.string(),
  value: z.string(),
  tone: z.string(),
})

export const watchlistItemDtoSchema = trendMetricDtoSchema

export const trackableTechnologyDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.enum(["言語", "フレームワーク", "ライブラリ", "ツール"]),
  category: z.string(),
  description: z.string(),
  selected: z.boolean().optional(),
})

export const storyRelatedLinkDtoSchema = z.object({
  label: z.string(),
  url: z.string().url(),
})

export const storyDetailsDtoSchema = z.object({
  overview: z.string(),
  keyPoints: z.array(z.string()),
  timeline: z.array(z.string()),
  relatedLinks: z.array(storyRelatedLinkDtoSchema),
})

export const storyDtoSchema = z.object({
  id: z.string(),
  likes_count: z.number().int().nonnegative(),
  kind: z.enum(["アップデート", "インシデント", "トレンド"]),
  topicIds: z.array(z.string()),
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  source: z.string(),
  time: z.string(),
  whyItMatters: z.string(),
  details: storyDetailsDtoSchema,
})

export const versionUpdateDtoSchema = z.object({
  id: z.string(),
  topic: z.string(),
  sourceType: z.literal("github_release"),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  externalId: z.string(),
  title: z.string(),
  version: z.string(),
  rawContent: z.string(),
  publishedAt: isoDateTimeSchema,
  category: z.literal("update"),
  importance: z.number().int(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export const incidentDtoSchema = z.object({
  id: z.string(),
  topic: z.string(),
  sourceType: z.literal("github_advisory"),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  externalId: z.string(),
  title: z.string(),
  rawContent: z.string(),
  severity: z.string(),
  packageName: z.string().nullable(),
  publishedAt: isoDateTimeSchema,
  category: z.literal("incident"),
  importance: z.number().int(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export const trendItemDtoSchema = z.object({
  id: z.string(),
  source: trendSourceSchema,
  tech: trendTechSchema,
  title: z.string(),
  url: z.string().url(),
  publishedAt: isoDateTimeSchema,
  score: z.number(),
  author: z.string().optional(),
  summary: z.string().optional(),
  rawText: z.string().optional(),
  externalId: z.string(),
  fetchedAt: isoDateTimeSchema,
})

export const dashboardDataDtoSchema = z.object({
  navItems: z.array(navItemDtoSchema),
  topicFilters: z.array(topicDtoSchema),
  marketPulse: z.array(trendMetricDtoSchema),
  briefingPoints: z.array(z.string()),
  watchlistItems: z.array(watchlistItemDtoSchema),
  trackableTechnologies: z.array(trackableTechnologyDtoSchema),
  topStories: z.array(storyDtoSchema),
})

export const listFeedQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  topic: z.string().trim().min(1).optional(),
})

export const aiDigestTargetTypeSchema = z.enum(["versionUpdate", "incident"])
export const aiDigestImportanceSchema = z.enum(["low", "medium", "high"])

export const aiDigestRouteParamsSchema = z.object({
  targetType: aiDigestTargetTypeSchema,
  targetId: z.string().trim().min(1),
})

export const aiDigestGeneratedContentSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  shortImpact: z.string().trim().min(1).nullable().optional(),
  recommendedAction: z.string().trim().min(1).nullable().optional(),
  importance: aiDigestImportanceSchema.nullable().optional(),
  background: z.string().trim().min(1).nullable().optional(),
  changedContent: z.string().trim().min(1).nullable().optional(),
  detailedImpact: z.string().trim().min(1).nullable().optional(),
  affectedAudience: z.string().trim().min(1).nullable().optional(),
  investigationMemo: z.string().trim().min(1).nullable().optional(),
  detailedReport: z.string().trim().min(1).nullable().optional(),
})

export const versionSyncRequestSchema = z.object({
  topic: z.string().trim().min(1).optional(),
})

export const technologiesResponseSchema = z.object({
  items: z.array(trackableTechnologyDtoSchema),
})

export const storiesResponseSchema = z.object({
  items: z.array(storyDtoSchema),
})

export const storyResponseSchema = z.object({
  item: storyDtoSchema,
})

export const versionUpdatesResponseSchema = z.object({
  items: z.array(versionUpdateDtoSchema),
})

export const incidentsResponseSchema = z.object({
  items: z.array(incidentDtoSchema),
})

export const aiDigestSummaryResponseSchema = z.object({
  id: z.string(),
  targetType: aiDigestTargetTypeSchema,
  targetId: z.string(),
  title: z.string(),
  summary: z.string(),
  shortImpact: z.string().nullable(),
  recommendedAction: z.string().nullable(),
  importance: aiDigestImportanceSchema.nullable(),
  generatedAt: isoDateTimeSchema,
})

export const aiDigestDetailResponseSchema =
  aiDigestSummaryResponseSchema.extend({
    sourceName: z.string().nullable(),
    sourceUrl: z.string().url().nullable(),
    sourcePublishedAt: isoDateTimeSchema.nullable(),
    detailedReport: z.string().nullable(),
    background: z.string().nullable(),
    changedContent: z.string().nullable(),
    detailedImpact: z.string().nullable(),
    affectedAudience: z.string().nullable(),
    investigationMemo: z.string().nullable(),
  })

export const aiDigestResponseSchema = aiDigestDetailResponseSchema

export const trendItemsResponseSchema = z.object({
  items: z.array(trendItemDtoSchema),
})

export const trendItemsQuerySchema = z.object({
  tech: trendTechSchema,
  source: trendListSourceSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

export const trendItemsByTechResponseSchema = z.object({
  tech: trendTechSchema,
  items: z.array(trendItemDtoSchema),
})

export const versionSyncTopicSummarySchema = z.object({
  fetched: z.number().int().nonnegative(),
  saved: z.number().int().nonnegative(),
  topic: z.string(),
})

export const versionSyncAllSummarySchema = z.object({
  syncedTopics: z.number().int().nonnegative(),
  topics: z.array(versionSyncTopicSummarySchema),
})

export const incidentSyncSummarySchema = z.object({
  fetched: z.number().int().nonnegative(),
  matched: z.number().int().nonnegative(),
  saved: z.number().int().nonnegative(),
  topics: z.record(z.string(), z.number().int().nonnegative()),
})

export const trendSyncSourceResultSchema = z.object({
  source: z.enum(["hn", "github", "qiita"]),
  tech: z.string(),
  fetched: z.number().int().nonnegative(),
  saved: z.number().int().nonnegative(),
  error: z.string().optional(),
})

export const trendSyncSummarySchema = z.object({
  fetched: z.number().int().nonnegative(),
  deduped: z.number().int().nonnegative(),
  saved: z.number().int().nonnegative(),
  results: z.array(trendSyncSourceResultSchema),
  failedSources: z.array(
    trendSyncSourceResultSchema.pick({
      source: true,
      tech: true,
      error: true,
    }),
  ),
})

export type TopicDto = z.infer<typeof topicDtoSchema>
export type NavItemDto = z.infer<typeof navItemDtoSchema>
export type TrendMetricDto = z.infer<typeof trendMetricDtoSchema>
export type WatchlistItemDto = z.infer<typeof watchlistItemDtoSchema>
export type TrackableTechnologyDto = z.infer<
  typeof trackableTechnologyDtoSchema
>
export type StoryRelatedLinkDto = z.infer<typeof storyRelatedLinkDtoSchema>
export type StoryDetailsDto = z.infer<typeof storyDetailsDtoSchema>
export type StoryDto = z.infer<typeof storyDtoSchema>
export type VersionUpdateDto = z.infer<typeof versionUpdateDtoSchema>
export type IncidentDto = z.infer<typeof incidentDtoSchema>
export type TrendItemDto = z.infer<typeof trendItemDtoSchema>
export type DashboardDataDto = z.infer<typeof dashboardDataDtoSchema>
export type ListFeedQuery = z.infer<typeof listFeedQuerySchema>
export type AiDigestTargetType = z.infer<typeof aiDigestTargetTypeSchema>
export type AiDigestImportance = z.infer<typeof aiDigestImportanceSchema>
export type AiDigestRouteParams = z.infer<typeof aiDigestRouteParamsSchema>
export type AiDigestGeneratedContent = z.infer<
  typeof aiDigestGeneratedContentSchema
>
export type VersionSyncRequest = z.infer<typeof versionSyncRequestSchema>
export type TechnologiesResponse = z.infer<typeof technologiesResponseSchema>
export type StoriesResponse = z.infer<typeof storiesResponseSchema>
export type StoryResponse = z.infer<typeof storyResponseSchema>
export type VersionUpdatesResponse = z.infer<
  typeof versionUpdatesResponseSchema
>
export type IncidentsResponse = z.infer<typeof incidentsResponseSchema>
export type AiDigestSummaryResponse = z.infer<
  typeof aiDigestSummaryResponseSchema
>
export type AiDigestDetailResponse = z.infer<
  typeof aiDigestDetailResponseSchema
>
export type AiDigestResponse = z.infer<typeof aiDigestResponseSchema>
export type TrendItemsResponse = z.infer<typeof trendItemsResponseSchema>
export type TrendItemsQuery = z.infer<typeof trendItemsQuerySchema>
export type TrendItemsByTechResponse = z.infer<
  typeof trendItemsByTechResponseSchema
>
export type VersionSyncTopicSummary = z.infer<
  typeof versionSyncTopicSummarySchema
>
export type VersionSyncAllSummary = z.infer<typeof versionSyncAllSummarySchema>
export type IncidentSyncSummary = z.infer<typeof incidentSyncSummarySchema>
export type TrendSyncSourceResult = z.infer<typeof trendSyncSourceResultSchema>
export type TrendSyncSummary = z.infer<typeof trendSyncSummarySchema>
export type TrendTech = z.infer<typeof trendTechSchema>
export type TrendSource = z.infer<typeof trendSourceSchema>
export type TrendListSource = z.infer<typeof trendListSourceSchema>
