---
name: collection-jobs
description: Standardize scheduled collection jobs in this repo. Use when implementing or refactoring GitHub Release sync, incident collection, scheduled orchestration, raw source persistence, or DB-first read architecture. Emphasizes collection-only jobs with no AI digest generation.
---

# Collection Jobs

Use this skill when working on scheduled sync architecture.

## Current Repo State

- Active scheduled collection currently covers GitHub Releases and GitHub Advisories.
- Trend collection code remains in the repo but the feature is on hold and should not be treated as an active product path.
- Current jobs already follow a raw-data-first pattern and return sync summaries.

## Core Rules

- Jobs collect raw source data only.
- Jobs do not generate AI digest.
- Jobs save raw data to DB.
- Routes read from DB-backed services.
- Routes do not call external APIs directly.

## Workflow

1. Fetch external source data in fetchers.
2. Normalize source payload into persisted entities.
3. Upsert raw data into DB.
4. Return sync summaries for operations visibility.
5. Leave interpretation and digest generation to later read flows.

## Placement

- Scheduled entrypoints: `apps/api/src/jobs/`
- External source access: `apps/api/src/services/**/fetch-*` or dedicated fetchers
- Orchestration: service layer
- Persistence: repository layer

## Good Patterns

- Idempotent syncs
- Stable external IDs
- Explicit summaries of fetched/saved/failed counts
- Narrow source-specific normalization functions

## Avoid

- Calling LLMs in jobs
- Combining read-route concerns into sync jobs
- Hiding persistence decisions inside routes
- Source-specific business logic spread across route handlers
- Re-activating trend jobs without first solving signal quality and product fit

## Load These References When Needed

- Job architecture checklist: `references/job-architecture-checklist.md`
