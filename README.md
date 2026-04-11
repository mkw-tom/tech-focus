# tech-focus

Turborepo + pnpm を使った monorepo の雛形です。

## 構成

- `apps/web`: Next.js アプリ
- `apps/api`: Node.js + Hono API

## セットアップ

```bash
pnpm install
pnpm dev
```

## 開発コマンド

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm typecheck
```

## Docker 開発環境

```bash
docker compose up --build
```

- Web: `http://localhost:3000`
- API: `http://localhost:8787`
