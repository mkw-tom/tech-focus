---
name: ai-digest
description: このリポジトリ向けの実務的な日本語エンジニアリングブリーフィングを生成・キャッシュするためのスキル。リリースやインシデント情報を、実務影響ベースで解釈・保存・再利用する機能を実装・更新するときに使う。
---

# AIダイジェスト

このスキルは、日本語の実務向けエンジニアリングブリーフィングを扱うときに使う。

目的は単純な翻訳ではない。

目的は:
- release / incident の実務影響を説明すること
- エンジニアが行動判断できる状態にすること
- 技術変化を短時間で理解できるようにすること

生データ収集そのものには使わない。

---

# 現在のリポジトリ状況

- 現在のコードベースには、LLM を使った digest generation pipeline はまだ実装されていない。
- AI 生成の release / incident digest を保存する Prisma model や shared contract も未実装。
- 現在永続化されているのは raw source data と metadata のみ。

---

# 基本ルール

- digest generation は thread detail や item detail など、「解釈が必要な画面」をユーザーが最初に開いたタイミングに限定する。
- collection job 実行時に digest を生成しない。
- fetcher や job では LLM を呼ばない。
- digest 再利用を前提にする前に、先に DB 永続化を実装する。
- 永続化後は、2 回目以降の読み取りで保存済み digest を再利用する。
- route から直接 model access を行わない。
- service 経由で digest generation と persistence を扱う。

---

# 日本語出力ルール

- 英語ソースを直訳調にしない。
- 「翻訳」ではなく「日本語の engineering briefing」として解釈する。
- 冗長な説明より、実務影響を優先する。
- 技術用語は不自然に翻訳しない。

自然に残す technical terms の例:
- React Compiler
- RSC
- App Router
- middleware
- hydration
- edge runtime

---

# 出力の目的

出力は以下を短く実務的に説明する:

- 何が変わったか
- 誰に影響するか
- 今すぐ対応が必要か
- 継続監視でよいか
- migration や investigation が必要か

---

# ワークフロー

1. 保存済み digest が存在するか確認する。
2. 存在する場合は再利用する。
3. digest persistence が未実装なら、先に schema / cache key / persistence flow を定義する。
4. 永続化済み raw source data を読み込む。
5. release / incident の practical impact を解釈する。
6. digest と派生 metadata を生成する。
7. persistence layer 経由で保存する。
8. service 経由で保存済み digest を返す。

---

# 推奨出力形式

- 日本語タイトル
- 短い概要
- エンジニアにとって重要な理由
- 推奨アクション
- importance
- 必要なら migration / investigation memo

---

# ガードレール

- source 根拠のない推測を生成しない。
- 宣伝調にしない。
- 技術ブログ風にしすぎない。
- 「エンジニア向け briefing」のトーンを維持する。
- そのタスクで追加していない限り、既存 digest table や cache layer が存在する前提でコードを書かない。
- route handler に business logic を書かない。

---

# 必要に応じて読む参照

- スタイル指針: `references/style-guide.md`
- キャッシュ方針: `references/cache-policy.md`
- 出力例: `assets/digest-output-example.json`