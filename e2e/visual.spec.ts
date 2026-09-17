import { test, expect } from "@playwright/test";

const viewports = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "tablet", viewport: { width: 768, height: 1024 } },
  { name: "mobile", viewport: { width: 375, height: 667 } },
];

test.describe("Visual regression and UI layout", () => {
  for (const { name, viewport } of viewports) {
    test(`visual layout snapshot on ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("./");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      await expect(page.locator("#head")).toBeVisible();
      await expect(page.locator("#map")).toBeVisible();

      // Snapshot full UI layout with dynamic map tiles masked for flake-free comparison
      await expect(page).toHaveScreenshot(`layout-${name}.png`, {
        mask: [page.locator(".leaflet-tile-pane")],
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  test("header component visual snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("./");
    await page.evaluate(() => document.fonts.ready);

    const head = page.locator("#head");
    await expect(head).toBeVisible();
    await expect(head).toHaveScreenshot("header.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("search autocomplete dropdown visual snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.route("**/geocodage/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [1.397, 43.582] },
              properties: {
                label: "14 Rue Michel Labrousse 31100 Toulouse",
                name: "14 Rue Michel Labrousse",
                city: "Toulouse",
                context: "31, Haute-Garonne, Occitanie",
                type: "street",
              },
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
              properties: {
                label: "Paris",
                name: "Paris",
                city: "Paris",
                context: "75, Paris, Île-de-France",
                type: "city",
              },
            },
          ],
        }),
      });
    });

    await page.goto("./");
    await page.evaluate(() => document.fonts.ready);

    const searchInput = page.locator(".photon-input");
    await searchInput.fill("paris");

    const autocomplete = page.locator(".photon-autocomplete");
    await expect(autocomplete).toBeVisible();
    await expect(autocomplete).toHaveScreenshot("search-autocomplete.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});
