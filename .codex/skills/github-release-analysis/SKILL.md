---
name: github-release-analysis
description: Analyze GitHub Releases for selected technologies in this repo, determine engineering impact, detect breaking changes and migration work, classify importance, and produce practical Japanese release briefings. Use when implementing or refining release analysis, release digestion, severity rules, or DB-backed release interpretation flows.
---

# GitHub Release Analysis

Use this skill when the task involves GitHub Releases as a product signal, not generic news summarization.

## Current Repo State

- Raw GitHub Releases are fetched and normalized in `apps/api/src/services/version/`.
- Persisted release data currently includes raw content, version, source metadata, and numeric `importance`.
- Importance is currently computed heuristically during normalization, not by an AI digest pipeline.
- Japanese release digest persistence is not implemented yet.

## Goals

- Parse release content into engineering-relevant facts.
- Detect breaking changes, migration work, and ecosystem direction.
- Classify practical importance for engineers tracking selected technologies.
- When the product adds it, generate concise Japanese briefings that explain impact, not just summarize text.

## Workflow

1. Identify the source release payload and the persisted shape already used by `apps/api`.
2. Separate raw release facts from interpreted output.
3. Apply severity and impact rules before writing any digest.
4. If the task includes digest generation, write Japanese output that answers:
   - What changed?
   - Who is affected?
   - What action is required?
   - Can teams defer adoption?
5. Keep current heuristics and future AI interpretation separate unless the task explicitly unifies them.

## Output Requirements

- Preserve product and API names in their original technical form.
- Prefer practical engineering implications over marketing wording.
- Call out migration steps explicitly when present.
- Distinguish clearly between:
  - breaking change
  - recommended follow-up
  - ecosystem signal
  - optional watch item

## Guardrails

- Do not treat every release as high importance.
- Do not infer breaking changes without textual evidence.
- Do not over-translate technical terminology into unnatural Japanese.
- Do not mix collection logic and digest generation in the same scheduled job.
- Do not assume a digest table or digest cache already exists in the current schema.

## Load These References When Needed

- Severity and importance rules: `references/severity-rules.md`
- Example output patterns: `references/japanese-briefing-patterns.md`

## Repo Fit

- Source collection belongs under `apps/api/src/services/version/`.
- Runtime contracts belong in `packages/shared/src/contracts.ts`.
- Current persisted release shape lives in `VersionUpdate` and shared DTOs.
- If local scripts are needed for deterministic parsing, place them under `scripts/`.
