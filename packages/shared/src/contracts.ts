import { z } from "zod"

const isoDateTimeSchema = z.string().datetime({ offset: true })

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
export type DashboardDataDto = z.infer<typeof dashboardDataDtoSchema>
export type ListFeedQuery = z.infer<typeof listFeedQuerySchema>
export type VersionSyncRequest = z.infer<typeof versionSyncRequestSchema>
export type TechnologiesResponse = z.infer<typeof technologiesResponseSchema>
export type StoriesResponse = z.infer<typeof storiesResponseSchema>
export type StoryResponse = z.infer<typeof storyResponseSchema>
export type VersionUpdatesResponse = z.infer<
  typeof versionUpdatesResponseSchema
>
export type IncidentsResponse = z.infer<typeof incidentsResponseSchema>
export type VersionSyncTopicSummary = z.infer<
  typeof versionSyncTopicSummarySchema
>
export type VersionSyncAllSummary = z.infer<typeof versionSyncAllSummarySchema>
export type IncidentSyncSummary = z.infer<typeof incidentSyncSummarySchema>
