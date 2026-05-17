# Tech Focus Agent Rules

## Project Philosophy

- This product is a personal engineering briefing system, not a generic tech news feed.
- Prioritize selected technology monitoring, GitHub Releases, incidents, and practical Japanese engineering briefings.
- Favor signal over breadth. Avoid features that increase noise without improving engineering decisions.

## Monorepo Rules

- `apps/web`: Next.js frontend.
- `apps/api`: Hono backend.
- `packages/shared`: shared Zod schemas and API contracts.
- Put cross-app request/response schemas in `packages/shared`.
- Do not duplicate API types between frontend and backend.

## Backend Architecture

- Routes stay thin.
- Services contain business logic.
- Repositories contain DB access logic.
- Fetchers contain external API access logic.
- Jobs orchestrate scheduled collection workflows.
- Routes must read from DB-backed services. Do not call external APIs directly from routes.

## AI Policy

- Collection jobs collect and persist raw source data only.
- AI digest generation does not run inside collection jobs.
- AI digest generation is not implemented yet in the current codebase.
- When introducing digest generation, trigger it from read flows after confirming persistence and cache strategy.
- Persist generated digest to DB and reuse it once that feature exists.
- Output Japanese briefings with natural technical terminology and practical engineering impact.

## Current Product State

- GitHub Releases and incidents are the active machine-collected sources.
- Trend detection is currently on hold because technology-only trend extraction was too noisy.
- Version updates currently persist raw release content plus numeric importance heuristics.
- Incidents currently persist raw advisory content plus normalized topic matching.

## Implementation Expectations

- Use Zod schemas for runtime validation at API boundaries.
- Prefer extending existing shared contracts over introducing one-off shapes.
- Keep frontend wording aligned with the product philosophy: technical monitoring assistant, not social/trend product.
- When adding new data pipelines, define source of truth, persistence point, and read path explicitly.

## Skill Routing

- For GitHub Release interpretation, use `github-release-analysis`.
- For Japanese engineering digest generation and caching behavior, use `ai-digest`.
- For scheduled sync and raw collection architecture, use `collection-jobs`.
- For route/service/repository/fetcher/job boundaries in Hono, use `hono-backend`.
- For Zod contracts and frontend/backend shared types, use `shared-schema`.

## Context Guidance

- Keep this file always-on and high-level.
- Put task-specific workflows in skills.
- Load references only when they are directly relevant to the current task.
