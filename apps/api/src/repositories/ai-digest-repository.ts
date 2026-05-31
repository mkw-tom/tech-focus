import { Prisma } from "@prisma/client"
import type {
  AiDigestGeneratedContent,
  AiDigestTargetType,
} from "@tech-focus/shared"
import { prisma } from "../lib/prisma.js"

export const aiDigestStatus = {
  completed: "COMPLETED",
  failed: "FAILED",
  processing: "PROCESSING",
} as const

export type AiDigestStatus =
  (typeof aiDigestStatus)[keyof typeof aiDigestStatus]

export class DuplicateAiDigestError extends Error {
  constructor() {
    super("AI digest already exists for this cache key")
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  )
}

export const aiDigestRepository = {
  async findByCacheKey(params: {
    targetType: AiDigestTargetType
    targetId: string
    promptVersion: string
  }) {
    return prisma.aiDigest.findUnique({
      where: {
        targetType_targetId_promptVersion: params,
      },
    })
  },

  async createProcessing(params: {
    targetType: AiDigestTargetType
    targetId: string
    promptVersion: string
    title: string
    modelName?: string
  }) {
    try {
      return await prisma.aiDigest.create({
        data: {
          targetType: params.targetType,
          targetId: params.targetId,
          title: params.title,
          summary: "",
          promptVersion: params.promptVersion,
          modelName: params.modelName,
          status: aiDigestStatus.processing,
        },
      })
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new DuplicateAiDigestError()
      }

      throw error
    }
  },

  async markProcessing(id: string, modelName?: string) {
    return prisma.aiDigest.update({
      where: { id },
      data: {
        modelName,
        status: aiDigestStatus.processing,
        errorMessage: null,
      },
    })
  },

  async markCompleted(
    id: string,
    content: AiDigestGeneratedContent,
    modelName: string,
  ) {
    return prisma.aiDigest.update({
      where: { id },
      data: {
        title: content.title,
        summary: content.summary,
        shortImpact: content.shortImpact ?? null,
        recommendedAction: content.recommendedAction ?? null,
        importance: content.importance ?? null,
        background: content.background ?? null,
        changedContent: content.changedContent ?? null,
        detailedImpact: content.detailedImpact ?? null,
        affectedAudience: content.affectedAudience ?? null,
        investigationMemo: content.investigationMemo ?? null,
        detailedReport: content.detailedReport ?? null,
        modelName,
        status: aiDigestStatus.completed,
        errorMessage: null,
        generatedAt: new Date(),
      },
    })
  },

  async markFailed(id: string, errorMessage: string, modelName?: string) {
    return prisma.aiDigest.update({
      where: { id },
      data: {
        modelName,
        status: aiDigestStatus.failed,
        errorMessage,
      },
    })
  },
}
