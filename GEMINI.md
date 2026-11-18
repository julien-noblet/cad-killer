# Cad-Killer Testing & Tooling Rules

## Local Testing on NixOS

- **Environment**: Use `devenv shell` (or `devenv test` for hooks, lint, typecheck, build, and unit tests).
- **Package Manager**: Always use `bun` (e.g. `bun run dev`, `bun run test:unit`).
- **Unit Tests**: `bun run test:unit` (Jest).
- **E2E Tests**:
  - Run locally with `--project=chromium`: `bunx playwright test --project=chromium` (or `test-e2e` inside `devenv shell`).
  - **Do not run Firefox locally**: The local NixOS Firefox lacks Playwright Juggler pipe protocol support and fails at launch. Firefox is tested in CI on Ubuntu runners.
- **Recommended Full Local Test Command**:
  ```bash
  devenv test && devenv shell -- bunx playwright test --project=chromium
  ```
