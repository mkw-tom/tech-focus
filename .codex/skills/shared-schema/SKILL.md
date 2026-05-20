---
name: shared-schema
description: このリポジトリの `packages/shared` に置く共有 API contract を標準化するためのスキル。Next.js フロントエンドと Hono バックエンドで共有する request body、query params、response payload、enum、source type、runtime validation を追加・変更するときに使う。
---

# 共有スキーマ

frontend と backend で data shape を一致させる必要があるときに使う。

## 基本ルール

- shared schema は `packages/shared` に置く。
- runtime validation には Zod を使う。
- frontend と backend は type を重複定義せず contract を共有する。
- request body、query params、response、enum、source type、importance level など、app 境界をまたぐ shape は shared schema から定義する。

## 現在のリポジトリ状況

- app 境界をまたぐ shared contract は現在 `packages/shared/src/contracts.ts` にある。
- trend 関連コードを保留状態で残しているため、legacy な trend contract が一部 repo 内に残っている。
- importance は専用の shared enum ではなく、release / incident DTO の数値 field として公開されている。

## ワークフロー

1. `packages/shared/src/contracts.ts` で Zod schema を定義・更新する。
2. 同じファイルから推論された TypeScript type を export する。
3. backend の route / service 側でその schema を使って parse するよう更新する。
4. frontend の data access code も shared contract を前提に更新する。
5. contract で置き換えられる重複 local type は削除する。

## 設計指針

- 大きな ad hoc object より、小さく組み合わせやすい schema を優先する。
- 命名は安定的で明示的にする。
- product rule が依存する値は freeform string ではなく enum 化する。

## 避けること

- `apps/web` にしかない一回限りの response type
- frontend が利用する public route なのに backend 側だけで閉じた request shape
- app 間で気づかないまま schema がずれていくこと

## 必要に応じて読む参照

- contract 確認項目: `references/contract-checklist.md`
