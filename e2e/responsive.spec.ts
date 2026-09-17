import { test, expect } from "@playwright/test";

const viewports = [
  { name: "Mobile (375x667)", viewport: { width: 375, height: 667 } },
  { name: "Tablet (768x1024)", viewport: { width: 768, height: 1024 } },
  { name: "Desktop (1440x900)", viewport: { width: 1440, height: 900 } },
];

test.describe("Responsive layout across viewports", () => {
  for (const { name, viewport } of viewports) {
    test(`renders header, map, and search control on ${name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("./");

      // Verify header
      const head = page.locator("#head");
      await expect(head).toBeVisible();
      await expect(head.locator("h1")).toHaveText(/CAD-Killer/i);

      // Verify map container
      const map = page.locator("#map");
      await expect(map).toBeVisible();
      const box = await map.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(300);
      expect(box!.height).toBeGreaterThan(300);

      // Verify search control is visible and operable
      const searchInput = page.locator(".photon-input");
      await expect(searchInput).toBeVisible();
      await searchInput.click();
      await expect(searchInput).toBeFocused();
    });
  }

  test("header title remains visible on mobile after zooming in or moving map", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    const headTitle = page.locator("#head h1");
    await expect(headTitle).toBeVisible();
    await expect(headTitle).toHaveText(/CAD-Killer/i);

    // Zoom into high zoom level (threshold > 14) and move map
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([43.582, 1.397], 16);
      map.fire("moveend");
    });

    // Verify title is still clearly visible and not replaced by a blank white box
    await expect(headTitle).toBeVisible();
    await expect(headTitle).toHaveText(/CAD-Killer/i);

    const titleStyles = await headTitle.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        visibility: computed.visibility,
        display: computed.display,
        height: rect.height,
        width: rect.width,
      };
    });
    expect(titleStyles.visibility).toBe("visible");
    expect(titleStyles.height).toBeGreaterThan(20);
    expect(titleStyles.width).toBeGreaterThan(100);
  });
});
