---
name: hono-backend
description: Standardize Hono backend architecture for this repo. Use when adding or refactoring routes, services, repositories, fetchers, or jobs in apps/api. Enforces thin routes, service-owned business logic, repository-owned DB logic, fetcher-owned external access, and shared Zod contracts.
---

# Hono Backend

Use this skill for backend architectural decisions in `apps/api`.

## Layer Rules

- Routes: parse input, call service, return validated output
- Services: business logic and orchestration
- Repositories: Prisma and DB queries only
- Fetchers: external API access only
- Jobs: scheduled workflows only

## Required Practices

- Parse request/query input with shared Zod schemas where possible.
- Validate response payloads against shared contracts.
- Keep route handlers short and boring.
- Put cross-source orchestration in services, not repositories.
- Follow the existing `routes -> services -> repositories/fetchers/jobs` split already used in `apps/api`.

## Avoid

- Business logic in routes
- Duplicated API types local to `apps/api` and `apps/web`
- Fetching external APIs directly from routes
- Repositories deciding product wording or digest output

## Workflow

1. Start from the contract in `packages/shared`.
2. Add or update route parsing and response validation.
3. Move decision-making into service functions.
4. Keep persistence focused in repositories.
5. Add fetchers or jobs only when the use case requires external sync.

## Load These References When Needed

- Backend boundary checklist: `references/backend-boundaries.md`
