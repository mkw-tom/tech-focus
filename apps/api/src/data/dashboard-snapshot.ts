export const navItems = [
  { id: "dashboard", label: "ホーム", href: "/" },
  { id: "tech-selection", label: "追いたい技術", href: "/topics" },
  { id: "bookmarks", label: "ブックマーク", href: "/bookmarks" },
  { id: "likes", label: "いいね", href: "/likes" },
]

export const topicFilters = [
  { id: "update", label: "アップデート", active: true },
  { id: "incident", label: "インシデント" },
  { id: "trend", label: "トレンド" },
]

export const topStories = [
  {
    id: "open-models-agents-product-surface",
    likes_count: 128,
    kind: "アップデート" as const,
    topicIds: ["nextjs", "react"],
    category: "AI",
    title:
      "Open models, edge inference, and agents are converging into one product surface",
    summary:
      "モデル選定の話ではなく、検索・要約・実行が一つの UI で回る構成が主流になりつつあるという整理。",
    source: "Tech Focus Daily",
    time: "8 min ago",
    whyItMatters:
      "検索、要約、実行の境界が薄くなり、ニュース UI も単なる一覧では弱くなっています。",
    details: {
      overview:
        "オープンモデル、エッジ推論、エージェント実行が別々の話ではなく、一つのプロダクト体験として統合され始めているという観測です。UI は検索窓起点でも、裏側では retrieval、reasoning、action が同時に設計対象になります。",
      keyPoints: [
        "モデル選定よりも、検索から実行までをどう一つの体験に束ねるかが差別化軸になっている。",
        "エッジ推論はコスト削減だけでなく、応答速度とプライバシー要件の両方で再評価されている。",
        "エージェント UI はチャット単体ではなく、スレッド、要約、ソース管理を含むワークスペース化が進んでいる。",
      ],
      timeline: [
        "08:00 新しい OSS ランタイム比較が公開",
        "09:15 エージェント設計の解説記事が公開",
        "11:20 エッジ推論ベンチマークが共有",
      ],
      relatedLinks: [
        { label: "Research memo", url: "https://example.com/research-memo" },
        { label: "Source thread", url: "https://example.com/source-thread" },
      ],
    },
  },
  {
    id: "vertical-saas-ai-native-workflows",
    likes_count: 42,
    kind: "インシデント" as const,
    topicIds: ["openai-api", "docker"],
    category: "Startups",
    title:
      "Vertical SaaS teams are rebuilding internal tools around AI-native workflows",
    summary:
      "既存業務の置き換えではなく、入力データの収集と判断フローを再設計している会社が伸びている。",
    source: "Signal Report",
    time: "21 min ago",
    whyItMatters:
      "プロダクトより運用フローを書き換える会社が強く、SaaS の見え方が変わっています。",
    details: {
      overview:
        "AI-native workflow を前提に内部オペレーションを組み替える企業が増え、単純な業務効率化以上に、監査・例外処理・承認フローの再設計が課題になっています。本稿では、その過程で起きた運用上の摩擦や障害対応も含めて整理しています。",
      keyPoints: [
        "入力データの揺れが大きい業務ほど、AI 導入時のガードレール設計が重要になる。",
        "ワークフロー変更時のインシデントは、モデル精度ではなく人間の運用との接続で起きやすい。",
        "再現性の低い障害に対しては、ログの粒度と説明責任が競争力になる。",
      ],
      timeline: [
        "07:45 新しい運用設計記事が公開",
        "10:10 既存 SaaS 導入チームの障害振り返りが投稿",
        "13:30 AI-native ERP のケーススタディが共有",
      ],
      relatedLinks: [
        { label: "Ops review", url: "https://example.com/ops-review" },
        { label: "Case study", url: "https://example.com/case-study" },
      ],
    },
  },
  {
    id: "explainable-operational-feeds",
    likes_count: 87,
    kind: "トレンド" as const,
    topicIds: ["typescript", "biome", "tailwindcss"],
    category: "Infra",
    title:
      "Why teams are moving from dashboards to explainable operational feeds",
    summary:
      "数値の監視だけではなく、変化の背景まで文章化して流すプロダクトが増えている。",
    source: "Infra Watch",
    time: "35 min ago",
    whyItMatters:
      "ダッシュボード中心の監視体験から、説明可能なフィードへの移行が進んでいます。",
    details: {
      overview:
        "監視や可観測性の文脈でも、グラフ中心のダッシュボードより『何が起きて、なぜ注目すべきか』を文章化したフィード型 UI が増えています。変化そのものより、変化の背景説明が価値になる流れです。",
      keyPoints: [
        "数値の異常検知だけではなく、背景説明を付与するフィードが運用負荷を下げている。",
        "チーム横断では、生データよりも意図付きの要約の方が共有しやすい。",
        "フロントエンド側もカード、スレッド、説明文の設計が重要になっている。",
      ],
      timeline: [
        "09:00 可観測性ベンダーの新機能発表",
        "12:10 フィード型運用 UI の分析記事が公開",
        "14:40 開発者コミュニティで実装事例が共有",
      ],
      relatedLinks: [
        { label: "Feature announcement", url: "https://example.com/feature" },
        { label: "Community notes", url: "https://example.com/community" },
      ],
    },
  },
]

export const marketPulse = [
  { label: "AI funding", value: "+18%", tone: "text-success" },
  { label: "Cloud spend", value: "+6.4%", tone: "text-info" },
  { label: "Chip supply", value: "Stable", tone: "text-warning" },
]

export const briefingPoints = [
  "AI 製品はチャットではなくワークスペース化が進行",
  "開発者向け SaaS は入力体験より意思決定体験が差別化点",
  "オペレーション領域は可視化から叙述へ移行中",
]

export const watchlistItems = [
  { label: "OpenAI ecosystem", value: "+12%", tone: "text-success" },
  { label: "Chipmakers", value: "Stable", tone: "text-info" },
  { label: "Devtools", value: "Mixed", tone: "text-warning" },
]

export const trackableTechnologies = [
  {
    id: "nextjs",
    name: "Next.js",
    group: "フレームワーク" as const,
    category: "Frontend",
    description: "App Router、rendering、deployment まわりの更新を追う",
    selected: true,
  },
  {
    id: "react",
    name: "React",
    group: "ライブラリ" as const,
    category: "Frontend",
    description: "Compiler、Server Components、Hooks の変化を追う",
    selected: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    group: "言語" as const,
    category: "Language",
    description: "型システムと DX 改善の変更点をまとめて追跡する",
    selected: true,
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    group: "ライブラリ" as const,
    category: "AI Platform",
    description: "モデル、SDK、docs、API surface の更新を確認する",
    selected: true,
  },
  {
    id: "hono",
    name: "Hono",
    group: "フレームワーク" as const,
    category: "Backend",
    description: "release、middleware、runtime 対応の変化を見る",
    selected: true,
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    group: "ライブラリ" as const,
    category: "Frontend",
    description: "design token、plugin、major release の変更を確認する",
  },
  {
    id: "biome",
    name: "Biome",
    group: "ツール" as const,
    category: "Tooling",
    description: "lint / format / config の更新をキャッチアップする",
  },
  {
    id: "docker",
    name: "Docker",
    group: "ツール" as const,
    category: "Infrastructure",
    description: "開発環境、イメージ構築、Compose の改善点を追う",
  },
]
