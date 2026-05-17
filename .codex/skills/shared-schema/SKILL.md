---
name: shared-schema
description: Standardize shared API contracts in packages/shared for this repo. Use when adding or changing request bodies, query params, response payloads, enums, source types, or runtime validation shared by Next.js frontend and Hono backend.
---

# Shared Schema

Use this skill when frontend and backend must agree on data shape.

## Core Rules

- Shared schemas belong in `packages/shared`.
- Use Zod for runtime validation.
- Frontend and backend share contracts instead of duplicating types.
- Request bodies, query params, responses, enums, source types, and importance levels should come from shared schemas when they cross app boundaries.

## Current Repo State

- Shared app-boundary contracts currently live in `packages/shared/src/contracts.ts`.
- The repo still contains some legacy trend-related contracts because the underlying code is retained on hold.
- Importance is currently exposed as numeric fields in release and incident DTOs, not as a dedicated shared enum.

## Workflow

1. Define or update the Zod schema in `packages/shared/src/contracts.ts`.
2. Export the inferred TypeScript type from the same file.
3. Update backend route/service usage to parse against the schema.
4. Update frontend data access code to rely on the shared contract.
5. Remove any duplicated local type if the contract now covers it.

## Design Guidance

- Prefer small composable schemas over large ad hoc objects.
- Keep naming stable and explicit.
- Add enums for bounded values instead of freeform strings when product rules depend on them.

## Avoid

- One-off response types only declared in `apps/web`
- Backend-only request shapes for public routes when frontend consumes them
- Silent schema drift between apps

## Load These References When Needed

- Contract checklist: `references/contract-checklist.md`
