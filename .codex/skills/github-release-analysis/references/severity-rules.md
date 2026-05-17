# Release Severity Rules

Use these rules to classify importance for engineering briefings.

## High

- Explicit breaking changes
- Required migration for existing users
- Runtime compatibility changes
- Security-sensitive release notes
- Removal or deprecation with immediate engineering cost

## Medium

- New capabilities that materially affect architecture or DX
- Important bug fixes for common workflows
- New official support for runtimes, frameworks, or deployment targets
- Deprecations without immediate breakage but with clear future impact

## Low

- Minor fixes with narrow scope
- Internal maintenance with little user-facing impact
- Documentation-only or housekeeping releases unless they reveal strategic direction

## Additional Heuristics

- Raise severity when the tracked technology is core to app runtime, build, deployment, or typing.
- Lower severity when the release is optional, additive, or narrowly scoped.
- If the release signals ecosystem direction without immediate action, keep importance separate from urgency.
