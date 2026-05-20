---
name: hono-backend
description: このリポジトリの Hono バックエンド構成を標準化するためのスキル。`apps/api` の route、service、repository、fetcher、job を追加・整理するときに使う。薄い route、service に置く business logic、repository に閉じた DB logic、fetcher に限定した外部アクセス、共有 Zod contract を徹底する。
---

# Hono バックエンド

`apps/api` のバックエンド設計判断ではこのスキルを使う。

## レイヤールール

- Routes: 入力を解釈し、service を呼び、検証済みの出力を返す
- Services: business logic と orchestration を持つ
- Repositories: Prisma と DB query のみに限定する
- Fetchers: 外部 API アクセスのみに限定する
- Jobs: 定期実行ワークフローのみに限定する

## 必須プラクティス

- request / query 入力は可能な限り shared Zod schema で parse する。
- response payload は shared contract で検証する。
- route handler は短く単純に保つ。
- 複数ソースをまたぐ orchestration は repository ではなく service に置く。
- `apps/api` で使っている `routes -> services -> repositories/fetchers/jobs` の分割に従う。

## 避けること

- route に business logic を置くこと
- `apps/api` と `apps/web` に API type を重複定義すること
- route から外部 API を直接取得すること
- repository に product wording や digest 出力判断を持たせること

## ワークフロー

1. `packages/shared` の contract から始める。
2. route の parse と response validation を追加・更新する。
3. 判断ロジックは service function に寄せる。
4. 永続化は repository に集中させる。
5. 外部同期が必要なユースケースにだけ fetcher や job を追加する。

## 必要に応じて読む参照

- バックエンド責務境界チェック: `references/backend-boundaries.md`
