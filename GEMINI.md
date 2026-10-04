# Cad-Killer Testing & Tooling Rules

## Local Testing on NixOS

- **Package Manager**: Always use `bun` (e.g. `bun run dev`, `bun run test:unit`).
- **Unit Tests**: `bun run test:unit` (Jest).
- **E2E Tests**:
  - Run locally with `--project=chromium`: `bunx playwright test --project=chromium`.
  - **Do not run Firefox locally**: The local NixOS Firefox lacks Playwright Juggler pipe protocol support and fails at launch. Firefox is tested in CI on Ubuntu runners.
- **Recommended Full Local Test Command**:
  ```bash
  bun run test:unit && bunx playwright test --project=chromium
  ```
