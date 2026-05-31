# Tech Focus エージェントルール

## プロジェクト方針

- このプロダクトは個人向けの engineering briefing system であり、汎用的な tech news feed ではない。
- 選定済み技術の監視、GitHub Releases、incidents、実務向けの日本語 engineering briefing を優先する。
- 広さより signal を優先する。エンジニアリング判断に役立たない noise を増やす機能は避ける。

## Monorepo ルール

- `apps/web`: Next.js frontend。
- `apps/api`: Hono backend。
- `packages/shared`: shared Zod schemas と API contracts。
- frontend / backend をまたぐ request / response schema は `packages/shared` に置く。
- frontend と backend で API type を重複定義しない。

## Backend アーキテクチャ

- Routes は薄く保つ。
- Services に business logic を置く。
- Repositories に DB access logic を置く。
- Fetchers に external API access logic を置く。
- Jobs は scheduled collection workflow の orchestration を担当する。
- Routes は DB-backed service から読む。route から外部 API を直接呼ばない。

## Backend 開発手順

- `apps/api/prisma/schema.prisma` を development DB schema の source of truth とする。
- development で schema 変更を DB に反映するときは `pnpm --filter @tech-focus/api db:push`、または repo の現在の `db:migrate` alias を使う。
- 明示的に依頼されない限り、手動で migration SQL を作成しない。
- Prisma schema を変更した後は `pnpm --filter @tech-focus/api db:generate` を実行する。
- dashboard や trackable technology の master data を更新するときは `pnpm --filter @tech-focus/api db:seed` を使う。
- seed / schema 変更後に raw source data を収集する場合は `pnpm --filter @tech-focus/api job:sync-version-updates` と `pnpm --filter @tech-focus/api job:sync-incidents` を使う。
- Collection jobs は raw source data の収集と永続化だけを行う。jobs や fetchers から AI digest generation を呼ばない。
- backend 変更の完了前に `pnpm --filter @tech-focus/api typecheck` と `pnpm --filter @tech-focus/api lint` を実行する。
- frontend / shared contract に影響する変更では、root の `pnpm typecheck` / `pnpm lint` を実行する。

## AI 方針

- Collection jobs は raw source data だけを収集・永続化する。
- AI digest generation は collection jobs や fetchers の中で実行しない。
- AI digest generation は、明示的なユーザー操作や detail view などの read flow から実行する。
- AI digest generation は、persistence と cache strategy がある状態で実行する。
- 生成した digest は DB に保存し、以後の read では保存済み digest を再利用する。
- 出力は自然な技術用語を使った日本語 briefing にする。
- 直訳ではなく、日本人エンジニアが実務影響を判断できる engineering briefing を出力する。

## 現在のプロダクト状態

- GitHub Releases と incidents が現在の active な machine-collected sources。
- Trend detection は、technology-only trend extraction が noise を増やしすぎたため保留中。
- Version updates は raw release content と numeric importance heuristics を永続化している。
- Incidents は raw advisory content と normalized topic matching を永続化している。

## 実装時の期待値

- API boundary の runtime validation には Zod schema を使う。
- 一回限りの shape を作るより、既存の shared contract を拡張することを優先する。
- frontend の文言は product philosophy に合わせる。social / trend product ではなく、technical monitoring assistant として表現する。
- 新しい data pipeline を追加するときは、source of truth、persistence point、read path を明確にする。

## Skill Routing

- GitHub Release interpretation には `github-release-analysis` を使う。
- 日本語 engineering digest generation と caching behavior には `ai-digest` を使う。
- scheduled sync と raw collection architecture には `collection-jobs` を使う。
- Hono の route / service / repository / fetcher / job boundaries には `hono-backend` を使う。
- Zod contracts と frontend / backend の shared types には `shared-schema` を使う。

## Context Guidance

- このファイルは常時参照される high-level rules として保つ。
- task-specific workflows は skills に置く。
- references は、その task に直接関係するときだけ読む。
