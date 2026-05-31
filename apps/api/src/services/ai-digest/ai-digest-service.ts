import type {
  AiDigestResponse,
  AiDigestRouteParams,
  AiDigestTargetType,
} from "@tech-focus/shared"
import {
  DuplicateAiDigestError,
  aiDigestRepository,
  aiDigestStatus,
} from "../../repositories/ai-digest-repository.js"
import { incidentRepository } from "../../repositories/incident-repository.js"
import { versionRepository } from "../../repositories/version-repository.js"
import { openAiDigestClient } from "./openai-digest-client.js"
import { buildAiDigestPrompt } from "./prompt-builder.js"
import type { AiDigestSourceData } from "./prompt-builder.js"

export const aiDigestPromptVersion = "ai-digest-v2"

const duplicateWaitAttempts = 10
const duplicateWaitMs = 500

export class AiDigestNotFoundError extends Error {
  constructor(targetType: AiDigestTargetType, targetId: string) {
    super(`Raw source data was not found: ${targetType}/${targetId}`)
  }
}

export class AiDigestGenerationError extends Error {}

export class AiDigestProcessingError extends Error {
  constructor() {
    super("AI digest generation is already processing")
  }
}

function serializeDigest(
  item: {
    id: string
    targetType: string
    targetId: string
    title: string
    summary: string
    impact: string | null
    shortImpact: string | null
    recommendedAction: string | null
    importance: string | null
    detailedReport: string | null
    background: string | null
    changedContent: string | null
    detailedImpact: string | null
    affectedAudience: string | null
    investigationMemo: string | null
    generatedAt: Date
  },
  source?: AiDigestSourceData,
): AiDigestResponse {
  const impactFallback = item.shortImpact ?? item.impact

  return {
    id: item.id,
    targetType: item.targetType as AiDigestTargetType,
    targetId: item.targetId,
    title: item.title,
    summary: item.summary,
    shortImpact: impactFallback,
    recommendedAction: item.recommendedAction,
    importance: item.importance as AiDigestResponse["importance"],
    sourceName: source?.sourceName ?? null,
    sourceUrl: source?.sourceUrl ?? null,
    sourcePublishedAt: source?.publishedAt ?? null,
    detailedReport: item.detailedReport,
    background: item.background,
    changedContent: item.changedContent,
    detailedImpact: item.detailedImpact ?? item.impact,
    affectedAudience: item.affectedAudience,
    investigationMemo: item.investigationMemo,
    generatedAt: item.generatedAt.toISOString(),
  }
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForCompletedDigest(params: AiDigestRouteParams) {
  for (let attempt = 0; attempt < duplicateWaitAttempts; attempt += 1) {
    await sleep(duplicateWaitMs)

    const digest = await aiDigestRepository.findByCacheKey({
      ...params,
      promptVersion: aiDigestPromptVersion,
    })

    if (digest?.status === aiDigestStatus.completed) {
      return digest
    }

    if (digest?.status === aiDigestStatus.failed) {
      return null
    }
  }

  return null
}

async function loadSourceData(
  params: AiDigestRouteParams,
): Promise<AiDigestSourceData> {
  if (params.targetType === "versionUpdate") {
    const item = await versionRepository.findById(params.targetId)

    if (!item) {
      throw new AiDigestNotFoundError(params.targetType, params.targetId)
    }

    return {
      targetType: params.targetType,
      topic: item.topic,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      title: item.title,
      rawContent: item.rawContent,
      publishedAt: item.publishedAt.toISOString(),
      metadata: {
        version: item.version,
        importance: item.importance,
      },
    }
  }

  const item = await incidentRepository.findById(params.targetId)

  if (!item) {
    throw new AiDigestNotFoundError(params.targetType, params.targetId)
  }

  return {
    targetType: params.targetType,
    topic: item.topic,
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    title: item.title,
    rawContent: item.rawContent,
    publishedAt: item.publishedAt.toISOString(),
    metadata: {
      severity: item.severity,
      packageName: item.packageName,
      importance: item.importance,
    },
  }
}

async function claimDigestGeneration(
  params: AiDigestRouteParams,
  title: string,
) {
  const modelName = openAiDigestClient.modelName()
  const existing = await aiDigestRepository.findByCacheKey({
    ...params,
    promptVersion: aiDigestPromptVersion,
  })

  if (existing?.status === aiDigestStatus.completed) {
    return existing
  }

  if (existing?.status === aiDigestStatus.processing) {
    const completed = await waitForCompletedDigest(params)

    if (completed) {
      return completed
    }

    throw new AiDigestProcessingError()
  }

  if (existing?.status === aiDigestStatus.failed) {
    return aiDigestRepository.markProcessing(existing.id, modelName)
  }

  try {
    return await aiDigestRepository.createProcessing({
      ...params,
      title,
      modelName,
      promptVersion: aiDigestPromptVersion,
    })
  } catch (error) {
    if (error instanceof DuplicateAiDigestError) {
      const completed = await waitForCompletedDigest(params)

      if (completed) {
        return completed
      }

      throw new AiDigestProcessingError()
    }

    throw error
  }
}

export const aiDigestService = {
  async getDigest(params: AiDigestRouteParams): Promise<AiDigestResponse> {
    const source = await loadSourceData(params)
    const cached = await aiDigestRepository.findByCacheKey({
      ...params,
      promptVersion: aiDigestPromptVersion,
    })

    if (cached?.status === aiDigestStatus.completed) {
      return serializeDigest(cached, source)
    }

    const digestRecord = await claimDigestGeneration(params, source.title)

    if (digestRecord.status === aiDigestStatus.completed) {
      return serializeDigest(digestRecord, source)
    }

    const modelName = openAiDigestClient.modelName()

    try {
      const content = await openAiDigestClient.generate(
        buildAiDigestPrompt(source),
      )
      const saved = await aiDigestRepository.markCompleted(
        digestRecord.id,
        content,
        modelName,
      )

      return serializeDigest(saved, source)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      await aiDigestRepository.markFailed(
        digestRecord.id,
        errorMessage,
        modelName,
      )

      throw new AiDigestGenerationError(errorMessage)
    }
  },
}
