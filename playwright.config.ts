import { defineConfig, devices } from "@playwright/test";
import fs from "fs";

const isNixOS = fs.existsSync("/run/current-system");

const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (fs.existsSync("/run/current-system/sw/bin/chromium")
    ? "/run/current-system/sw/bin/chromium"
    : undefined);

const firefoxWrapperPath = "./scripts/firefox-playwright.sh";
const firefoxPath =
  process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH ||
  (isNixOS && fs.existsSync(firefoxWrapperPath)
    ? firefoxWrapperPath
    : undefined);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      animations: "disabled",
    },
  },
  use: {
    baseURL: "http://localhost:9000/cad-killer/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          ...(chromiumPath ? { executablePath: chromiumPath } : {}),
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          ...(firefoxPath ? { executablePath: firefoxPath } : {}),
        },
      },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:9000/cad-killer/",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
