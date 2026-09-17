import { test, expect } from "@playwright/test";

test.describe("Security and XSS mitigation", () => {
  const maliciousPayload = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [2.3522, 48.8566],
        },
        properties: {
          label: "Malicious Place",
          name: "<img src=x onerror=window.xssTriggered=true>",
          type: "street",
          city: "Paris",
          context: "75, Paris, Île-de-France",
        },
      },
    ],
  };

  test("prevents XSS in search autocomplete and reverse label", async ({
    page,
  }) => {
    await page.route("**/geocodage/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(maliciousPayload),
      });
    });

    await page.route("**/geocodage/reverse/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
              properties: {
                label: "<img src=x onerror=window.xssTriggered=true>",
                name: "Malicious",
              },
            },
          ],
        }),
      });
    });

    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    // Test Search Autocomplete XSS
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("test");

    const result = page.locator(".photon-autocomplete li").first();
    await expect(result).toBeVisible();

    // Verify raw text is present but script was not executed
    await expect(result).toContainText(
      "<img src=x onerror=window.xssTriggered=true>",
    );
    const xssTriggeredSearch = await page.evaluate(
      () => (window as any).xssTriggered,
    );
    expect(xssTriggeredSearch).toBeUndefined();

    // Test Reverse Geocode XSS
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([48.8566, 2.3522], 16);
      map.fire("moveend");
    });

    const reverseLabel = page.locator(".reverse-label");
    await expect(reverseLabel).toContainText(
      "<img src=x onerror=window.xssTriggered=true>",
      { timeout: 10000 },
    );

    const xssTriggeredReverse = await page.evaluate(
      () => (window as any).xssTriggered,
    );
    expect(xssTriggeredReverse).toBeUndefined();
  });
});
