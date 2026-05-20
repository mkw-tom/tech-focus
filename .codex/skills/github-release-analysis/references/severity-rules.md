# Release の severity ルール

エンジニア向けブリーフィングの重要度を分類するときは、このルールを使う。

## High

- 明示的な breaking change
- 既存利用者に必須の移行対応
- runtime compatibility の変更
- security 的に重要な release note
- 直近で工数影響が出る removal や deprecation

## Medium

- アーキテクチャや DX に実質影響する新機能
- 一般的な workflow に効く重要な bug fix
- runtime、framework、deployment target への新しい公式対応
- いますぐ壊れはしないが将来影響が明確な deprecation

## Low

- 影響範囲の狭い小さな修正
- 利用者影響がほぼない内部保守
- 戦略的な方向性が読み取れない限り、documentation のみや housekeeping 中心の release

## 追加ヒューリスティクス

- 追跡対象技術が app runtime、build、deployment、typing の中核なら severity を上げる。
- release が任意導入、追加機能、狭い範囲向けなら severity を下げる。
- すぐ行動は不要でも ecosystem の方向性を示す release は、importance と urgency を分けて扱う。
