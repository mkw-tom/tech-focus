# Digest Cache Policy

- Digest is derived data from persisted raw source content.
- Cache key should be stable per source item and source revision.
- Recompute only when raw source content changes or the stored digest version is invalidated.
- Prefer DB persistence over in-memory or request-local caching for product behavior.
- Services should own cache lookup and write-back behavior.
