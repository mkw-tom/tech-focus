"use client"

import type {
  AiDigestSummaryResponse,
  AiDigestTargetType,
} from "@tech-focus/shared"
import Link from "next/link"
import { useState } from "react"
import { MdAutoAwesome } from "react-icons/md"
import { fetchAiDigest } from "../_lib/ai-digest-client"

type DigestState =
  | { status: "idle"; item?: undefined; error?: undefined }
  | { status: "loading"; item?: AiDigestSummaryResponse; error?: undefined }
  | { status: "success"; item: AiDigestSummaryResponse; error?: undefined }
  | { status: "error"; item?: AiDigestSummaryResponse; error: string }

type AiDigestPanelProps = {
  targetType: AiDigestTargetType
  targetId: string
  tone?: "primary" | "error"
}

const importanceTone = {
  high: "badge-error",
  medium: "badge-warning",
  low: "badge-ghost",
} as const

export function AiDigestPanel({
  targetType,
  targetId,
  tone = "primary",
}: AiDigestPanelProps) {
  const [digestState, setDigestState] = useState<DigestState>({
    status: "idle",
  })

  const isLoading = digestState.status === "loading"
  const digest = digestState.item

  async function handleDigestClick() {
    if (isLoading) {
      return
    }

    setDigestState((current) => ({
      status: "loading",
      item: current.item,
    }))

    try {
      const item = await fetchAiDigest(targetType, targetId)
      setDigestState({ status: "success", item })
    } catch {
      setDigestState({
        status: "error",
        item: digestState.item,
        error: "AI解釈を生成できませんでした。時間を置いて再試行してください。",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className={`btn btn-sm px-3 ${
            tone === "error"
              ? "btn-outline btn-error"
              : "btn-outline btn-primary"
          }`}
          onClick={handleDigestClick}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <MdAutoAwesome className="text-base" aria-hidden="true" />
          )}
          AI解釈
        </button>
      </div>

      {digest ? (
        <section className="rounded-lg border border-base-300 bg-base-200/40 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-base-content/65">
              AI Briefing
            </p>
            {digest.importance ? (
              <span
                className={`badge badge-sm ${
                  importanceTone[digest.importance]
                }`}
              >
                {digest.importance}
              </span>
            ) : null}
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold leading-snug">{digest.title}</h3>
            <p className="text-sm leading-6 text-base-content/75">
              {digest.summary}
            </p>
            {digest.shortImpact ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-base-content/45">
                  実務影響
                </p>
                <p className="text-sm leading-6 text-base-content/75">
                  {digest.shortImpact}
                </p>
              </div>
            ) : null}
            {digest.recommendedAction ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-base-content/45">
                  推奨アクション
                </p>
                <p className="text-sm leading-6 text-base-content/75">
                  {digest.recommendedAction}
                </p>
              </div>
            ) : null}
            <div className="pt-1">
              <Link
                className={`btn btn-sm px-3 ${
                  tone === "error" ? "btn-error text-white" : "btn-primary"
                }`}
                href={`/ai-digests/${targetType}/${targetId}`}
              >
                より詳しく
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {digestState.status === "error" ? (
        <p className="text-sm text-error">{digestState.error}</p>
      ) : null}
    </div>
  )
}
