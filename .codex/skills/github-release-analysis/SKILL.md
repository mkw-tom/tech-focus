---
name: github-release-analysis
description: このリポジトリで追跡している技術の GitHub Releases を分析し、実務影響、breaking change、移行対応、重要度を判断して、日本語の実践的なリリースブリーフィングを作るためのスキル。release 分析、digest 化、severity ルール、DB-backed な release 解釈フローを実装・改善するときに使う。
---

# GitHub Release 分析

GitHub Releases をプロダクト上の重要シグナルとして扱うタスクで使う。一般的なニュース要約用途では使わない。

## 現在のリポジトリ状況

- raw GitHub Releases の取得と正規化は `apps/api/src/services/version/` にある。
- 現在保存している release data には、raw content、version、source metadata、数値の `importance` が含まれる。
- `importance` は AI ダイジェストではなく、正規化時の heuristic で計算している。
- 日本語リリースダイジェストの永続化はまだ未実装。

## 目的

- release 本文から実務に関係する事実を抽出する。
- breaking change、移行作業、エコシステムの方向性を検出する。
- 対象技術を追うエンジニアにとっての実用的な重要度を分類する。
- プロダクトに追加する場合は、本文の要約ではなく影響を説明する簡潔な日本語ブリーフィングを作る。

## ワークフロー

1. `apps/api` で使っている source release payload と既存の永続化 shape を確認する。
2. raw release facts と解釈済み出力を分離する。
3. ダイジェストを書く前に severity と impact のルールを適用する。
4. タスクにダイジェスト生成が含まれるなら、次に答える日本語出力を書く。
   - 何が変わったか
   - 誰に影響するか
   - どんな対応が必要か
   - いまは見送り可能か
5. 明示的に統合するタスクでない限り、現行 heuristic と将来の AI 解釈は分けて扱う。

## 出力要件

- 製品名や API 名は技術用語として元の表記を保つ。
- マーケティング文言より、実務上のエンジニアリング影響を優先する。
- 移行手順がある場合は明示する。
- 次を明確に区別する。
  - breaking change
  - 推奨フォローアップ
  - エコシステム上のシグナル
  - 任意の watch 項目

## ガードレール

- すべての release を高重要度扱いしない。
- テキスト根拠なしに breaking change を推測しない。
- 技術用語を不自然な日本語へ過剰翻訳しない。
- 同じ scheduled job の中で collection logic と digest 生成を混ぜない。
- 現行 schema に digest table や digest cache がすでにある前提にしない。

## 必要に応じて読む参照

- severity / importance ルール: `references/severity-rules.md`
- 出力パターン例: `references/japanese-briefing-patterns.md`

## このリポジトリでの配置

- source collection は `apps/api/src/services/version/` 配下に置く。
- runtime contract は `packages/shared/src/contracts.ts` に置く。
- 現在の永続化済み release shape は `VersionUpdate` と shared DTOs にある。
- 決定的な parsing のために local script が必要なら `scripts/` 配下に置く。
