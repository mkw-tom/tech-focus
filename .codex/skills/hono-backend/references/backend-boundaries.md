# Backend Boundary Checklist

## Routes

- Request parsing
- Shared schema validation
- Service call
- Response serialization

## Services

- Product rules
- Orchestration across repositories and fetchers
- Digest lookup or generation trigger decisions
- Summary construction

## Repositories

- Prisma queries
- Upserts
- Transaction handling
- No product interpretation

## Fetchers

- HTTP requests
- Source-specific response parsing
- No DB writes

## Jobs

- Scheduled orchestration
- Collection only
- No user-facing wording generation
