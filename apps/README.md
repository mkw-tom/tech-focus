# Tech Focus

知りたい技術を、必要な分だけキャッチアップするための開発者向け情報集約アプリ。

---

## 🧱 Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React

### Backend
- Hono
- TypeScript

### Database
- Neon (PostgreSQL)
- Prisma ORM

### Infrastructure
- Vercel (Frontend)
- Render (Backend)
- GitHub Actions（定期ジョブ）

### AI
- OpenAI API（今後：要約・質問機能）

---

## ⚙️ Features & Data Sources

### 🔄 Update Detection（バージョンアップ検知）
各技術スタックの公式アップデートを取得

**Data Sources**
- GitHub Releases API  
  - https://api.github.com/repos/{owner}/{repo}/releases

**対象例**
- React
- TypeScript
- Next.js
- Hono
- Node.js

---

### 🚨 Incident Detection（インシデント検知）
セキュリティ脆弱性や重大な問題を検知

**Data Sources**
- GitHub Advisory Database API  
  - https://api.github.com/advisories

**取得内容**
- 脆弱性情報（CVE / GHSA）
- severity（critical / high / medium）
- 影響範囲

---

## 🧠 Design Philosophy

このプロダクトは以下の思想で設計されています：

- **既存技術で確実に処理**
  - データ取得・保存・分類はバックエンドロジックで実行

- **AIは意味付けに集中**
  - 要約
  - 影響分析
  - 自然言語での理解支援

---

## 🔁 Architecture Overview
```
External APIs
↓
Fetch / Normalize
↓
Database（Neon + Prisma）
↓
API（Hono）
↓
Frontend（Next.js）
↓
AI Layer（理解支援）
```

---

## 🚀 Future Work

- AIによる要約生成
- 「実務影響」の自動分析
- ユーザーごとの技術スタック最適化
- トレンドスコアの高度化

---