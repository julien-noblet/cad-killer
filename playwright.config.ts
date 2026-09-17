import { defineConfig, devices } from "@playwright/test";
import fs from "fs";

const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (fs.existsSync("/run/current-system/sw/bin/chromium")
    ? "/run/current-system/sw/bin/chromium"
    : undefined);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:9000/cad-killer/",
    trace: "on-first-retry",
    launchOptions: {
      ...(chromiumPath ? { executablePath: chromiumPath } : {}),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:9000/cad-killer/",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
