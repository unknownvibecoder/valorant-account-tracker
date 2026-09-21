FILE: `docs/DEVELOPMENT.md`
```markdown
# Development & Git Strategy

## Git Branch Naming Conventions

- `main`: Production-ready code only.
- `feature/<issue-id>-<description>`: New features (e.g., `feature/issue-2-search-bar`).
- `fix/<issue-id>-<description>`: Bug fixes (e.g., `fix/issue-9-api-timeout`).

## Commit Message Format

Follow Conventional Commits:
- `feat: add player search validation`
- `fix: prevent layout shift on match history card`
- `docs: update setup guidelines`
- `test: add unit test for Zod validator`