# Job Architecture Checklist

- Define source of truth for each entity.
- Define stable dedupe key.
- Persist raw source content needed for later interpretation.
- Return a sync summary with fetched, saved, and failed counts.
- Keep job safe to rerun.
- Keep rate-limited external access out of request/response routes.
- If a job is put on hold, disable scheduling separately from deleting source code.
