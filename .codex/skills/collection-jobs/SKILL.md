---
name: collection-jobs
description: このリポジトリの定期収集ジョブを標準化するためのスキル。GitHub Release 同期、インシデント収集、定期実行オーケストレーション、生ソース永続化、DB-first の read アーキテクチャを実装・整理するときに使う。AI ダイジェストを job に入れない前提を重視する。
---

# 収集ジョブ

定期同期アーキテクチャを触るときはこのスキルを使う。

## 現在のリポジトリ状況

- 現在アクティブな定期収集対象は GitHub Releases と GitHub Advisories。
- trend 収集コードは repo に残っているが、機能自体は保留中であり、現行プロダクトの主経路として扱わない。
- 現在の job はすでに raw-data-first の形を取り、sync summary を返している。

## 基本ルール

- job が収集するのは raw source data のみ。
- job で AI ダイジェストを生成しない。
- job は raw data を DB に保存する。
- route は DB-backed service から読む。
- route から外部 API を直接呼ばない。

## ワークフロー

1. 外部ソースの取得は fetcher で行う。
2. source payload を永続化用 entity に正規化する。
3. raw data を DB に upsert する。
4. 運用確認用に sync summary を返す。
5. 解釈やダイジェスト生成は後段の read flow に委ねる。

## 配置

- 定期実行の入口: `apps/api/src/jobs/`
- 外部ソースアクセス: `apps/api/src/services/**/fetch-*` または専用 fetcher
- オーケストレーション: service layer
- 永続化: repository layer

## 良いパターン

- 冪等に再実行できる sync
- 安定した external ID
- fetched / saved / failed 件数を明示した summary
- 対象ソースに絞った小さな正規化関数

## 避けること

- job から LLM を呼ぶこと
- read route の責務を sync job に混ぜること
- 永続化方針を route の中に隠すこと
- ソース固有の business logic を route handler に分散させること
- signal quality と product fit を解決しないまま trend job を再開すること

## 必要に応じて読む参照

- job アーキテクチャ確認項目: `references/job-architecture-checklist.md`
