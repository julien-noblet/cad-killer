import { test, expect } from "@playwright/test";

test.describe("URL Hash navigation and synchronization", () => {
  test("initializes map position from URL hash", async ({ page }) => {
    // Navigate with a specific zoom and center hash
    await page.goto("./#15/48.8566/2.3522");
    await expect(page.locator("#map")).toBeVisible();

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const map = (window as any).map;
          if (!map) return null;
          const center = map.getCenter();
          return {
            zoom: map.getZoom(),
            lat: Math.round(center.lat * 1000) / 1000,
            lng: Math.round(center.lng * 1000) / 1000,
          };
        });
      })
      .toEqual({
        zoom: 15,
        lat: 48.857,
        lng: 2.352,
      });
  });

  test("updates URL hash when map moves", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([45.764, 4.8357], 14);
    });

    await expect
      .poll(async () => {
        return page.evaluate(() => window.location.hash);
      })
      .toContain("#14/45.764");
  });
});
