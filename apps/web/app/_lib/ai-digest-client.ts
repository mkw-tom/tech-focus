"use client"

import {
  type AiDigestSummaryResponse,
  type AiDigestTargetType,
  aiDigestSummaryResponseSchema,
} from "@tech-focus/shared"

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787"

export async function fetchAiDigest(
  targetType: AiDigestTargetType,
  targetId: string,
): Promise<AiDigestSummaryResponse> {
  const response = await fetch(
    `${apiBaseUrl}/ai-digests/${targetType}/${targetId}`,
    {
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error(`AI digest request failed: ${response.status}`)
  }

  return aiDigestSummaryResponseSchema.parse(await response.json())
}
