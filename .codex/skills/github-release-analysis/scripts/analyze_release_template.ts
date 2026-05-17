type ReleaseAnalysisInput = {
  sourceName: string
  version: string
  title: string
  rawContent: string
}

type ReleaseAnalysisOutput = {
  importance: "high" | "medium" | "low"
  hasBreakingChange: boolean
  summaryJa: string
  actionJa: string
}

export function analyzeReleaseTemplate(
  input: ReleaseAnalysisInput,
): ReleaseAnalysisOutput {
  const normalized = input.rawContent.toLowerCase()
  const hasBreakingChange =
    normalized.includes("breaking") || normalized.includes("deprecated")

  return {
    importance: hasBreakingChange ? "high" : "medium",
    hasBreakingChange,
    summaryJa: `${input.sourceName} ${input.version} の変更点を確認するための雛形出力です。`,
    actionJa: hasBreakingChange
      ? "breaking change と migration 記述を優先確認してください。"
      : "既存実装への影響があるかを要点ベースで確認してください。",
  }
}
