---
name: ai-digest
description: Generate and cache practical Japanese engineering digests for this repo. Use when implementing or updating AI-generated briefings, first-open digest behavior, DB persistence of digests, or output style for release and incident interpretation.
---

# AI Digest

Use this skill for Japanese engineering briefings, not for raw collection.

## Current Repo State

- There is no implemented LLM digest pipeline in the current codebase.
- No Prisma model or shared contract currently stores AI-generated release or incident digests.
- Existing collection flows persist raw source content and metadata only.

## Core Rules

- If this feature is introduced, generate digest only when a user first opens a thread, detail page, or item that needs interpretation.
- Do not generate digest during scheduled collection jobs.
- Add DB persistence before relying on digest reuse behavior.
- Reuse saved digest on subsequent reads once persistence exists.

## Output Goals

- Explain practical engineering impact.
- Preserve technical terms naturally.
- Avoid literal translation from English source text.
- Prefer actionable interpretation over verbose summaries.

## Workflow

1. Confirm whether a persisted digest already exists.
2. If it exists, reuse it.
3. If the current task is adding this feature, define schema, persistence path, and cache key first.
4. Generate digest from persisted raw source data.
5. Save the digest and any derived fields that should be reused.
6. Return persisted output through the normal service path.

## Output Shape

- Short overview in Japanese
- Why it matters for engineers
- Action or watch recommendation
- Optional migration or investigation note

## Guardrails

- No digest generation in fetchers or jobs.
- No direct model call from routes.
- Do not invent operational steps unsupported by source data.
- Keep tone practical, not promotional.
- Do not write prompts that assume an existing digest table or cache layer unless the task adds it.

## Load These References When Needed

- Style rules: `references/style-guide.md`
- Caching policy: `references/cache-policy.md`
