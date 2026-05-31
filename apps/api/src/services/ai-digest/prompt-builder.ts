import type { AiDigestTargetType } from "@tech-focus/shared"

const rawContentMaxLength = 18_000

export type AiDigestSourceData = {
  targetType: AiDigestTargetType
  topic: string
  sourceName: string
  sourceUrl: string
  title: string
  rawContent: string
  publishedAt: string
  metadata: Record<string, string | number | null>
}

function truncateRawContent(rawContent: string) {
  if (rawContent.length <= rawContentMaxLength) {
    return rawContent
  }

  return `${rawContent.slice(0, rawContentMaxLength)}\n\n[raw content truncated]`
}

export function buildAiDigestPrompt(source: AiDigestSourceData) {
  return `あなたは日本人エンジニア向けの実務ブリーフィングを書く技術編集者です。

目的:
- 原文の直訳ではなく、実務判断に使える日本語 engineering briefing を作る
- 根拠のない推測を避け、保存済み source data から読み取れる範囲で説明する
- 技術用語は React Compiler / RSC / App Router / middleware / hydration / edge runtime のように自然な英語のまま残す
- 宣伝調やブログ調にしない

必ず次の JSON だけを返してください。Markdown や説明文は不要です。
{
  "title": "日本語タイトル",
  "summary": "スレッド表示用。1〜2文の短い概要",
  "shortImpact": "スレッド表示用。重要かどうか判断できる1文",
  "recommendedAction": "スレッド表示用。推奨アクションを1文",
  "importance": "low | medium | high",
  "background": "詳細表示用。背景を実務文脈で説明",
  "changedContent": "詳細表示用。何が変わったか",
  "detailedImpact": "詳細表示用。実務影響と影響が限定的なケース",
  "affectedAudience": "詳細表示用。影響を受けるチームや利用者",
  "investigationMemo": "詳細表示用。確認すべき観点、migration / investigation memo",
  "detailedReport": "詳細表示用。背景、変更内容、実務影響、対応判断をまとめた engineering briefing"
}

文章量:
- summary は 1〜2文
- shortImpact は 1文
- recommendedAction は 1文
- detailedReport は詳しくてよいが、冗長な翻訳ではなく実務影響中心にする

source:
${JSON.stringify(
  {
    targetType: source.targetType,
    topic: source.topic,
    sourceName: source.sourceName,
    sourceUrl: source.sourceUrl,
    title: source.title,
    publishedAt: source.publishedAt,
    metadata: source.metadata,
    rawContent: truncateRawContent(source.rawContent),
  },
  null,
  2,
)}`.trim()
}
