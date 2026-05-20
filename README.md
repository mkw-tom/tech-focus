# 🧠 Tech Briefing AI

- GitHub Releases や Incident 情報を収集し、
AI によって実務向けのエンジニアリングブリーフィングへ変換しようというプロジェクトです🧑‍💻


<br>
<br>

# 🚀 主な機能

## 📦 アップデート監視
- GitHub Releases から特定の技術バージョン更新を収集・保存。⇨ スレッド形式で表示し、AIによって解釈させる。
- 将来的に蓄積したデータをRAGで学習させ、最新動向と予測ができるような仕組みを目指す。

## 🚨 インシデント監視
- security advisory や ecosystem incident を監視

## ✨ AI Digest

収集したトレンド情報やインシデント上ほを元に、
実務向けの日本語ダイジェストを生成。

<br>
<br>

# 🏗️ アーキテクチャ

## Frontend
- Next.js
- React
- TypeScript

## Backend
- TypeScript
- Hono

## Database
- Prisma
- NeonDB

## Authentication
- NeonAuth

## LLM
- OpenAI API

## Other
- turborepo
- zod

<br>
<br>


# 🎯 このプロジェクトが目指すもの

✅ technical monitoring assistant  
✅ engineering briefing system  
✅ 実務向け技術変化解釈レイヤー  

を目指している。
