# Release Digest Example

## 何が変わったか

React 19.x 系で server-side APIs 周辺の更新と deprecation 整理が入り、既存の周辺実装に確認コストが発生する変更です。

## 実務への影響

日常運用が直ちに壊れる種類ではありませんが、framework 側が将来的に新しい前提へ寄る可能性があります。独自ラッパーや server integration を持つチームは追従判断が必要です。

## 対応方針

- 今すぐ全面移行は不要
- 次回依存更新前に release notes の breaking/deprecation 節を確認
- 影響範囲が広いなら検証タスクを先に切る
