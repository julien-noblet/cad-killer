import { test, expect, type Page } from "@playwright/test";

const TOULOUSE_LABROUSSE = {
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [1.397, 43.582] },
  properties: {
    label: "14 Rue Michel Labrousse 31100 Toulouse",
    name: "14 Rue Michel Labrousse",
    city: "Toulouse",
    type: "housenumber" as const,
  },
};

const TOULOUSE_REPUBLIQUE = {
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [1.442, 43.599] },
  properties: {
    label: "14 Rue de la République 31000 Toulouse",
    name: "14 Rue de la République",
    city: "Toulouse",
    type: "housenumber" as const,
  },
};

function mockSearchApi(page: Page) {
  return page.route("**/geocodage/search/**", async (route) => {
    const url = new URL(route.request().url());
    const query = (url.searchParams.get("q") || "").toLowerCase();

    let features: (typeof TOULOUSE_LABROUSSE)[] = [];
    if (query.includes("labrousse")) {
      features = [TOULOUSE_LABROUSSE];
    } else if (query.includes("14 rue")) {
      features = [TOULOUSE_LABROUSSE, TOULOUSE_REPUBLIQUE];
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        type: "FeatureCollection",
        features,
      }),
    });
  });
}

test.describe("Mobile geo navigation link on address points", () => {
  test.beforeEach(async ({ page }) => {
    await mockSearchApi(page);
  });

  test("Scenario 1: Mobile view displays a visible geo: navigation link in marker popup", async ({
    page,
  }) => {
    // Emulate mobile viewport (e.g. iPhone SE / Android)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse, toulouse");

    // Click autocomplete result
    const suggestion = page.locator(".photon-autocomplete li").first();
    await expect(suggestion).toBeVisible();
    await suggestion.click();

    // Click marker on map to open popup
    const marker = page.locator(".leaflet-marker-icon").first();
    await expect(marker).toBeVisible();
    await marker.click();

    // Popup content is visible
    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("14 Rue Michel Labrousse");

    // Geo link element
    const geoLink = popup.locator("a.geo");
    await expect(geoLink).toBeVisible();
    await expect(geoLink).toHaveAttribute("href", "geo:43.582,1.397");
    await expect(geoLink).toHaveAttribute(
      "aria-label",
      "Lancer la navigation GPS",
    );
    await expect(geoLink.locator("svg")).toBeVisible();

    // Computed style check: visible and block display on mobile
    const styles = await geoLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        visibility: computed.visibility,
        width: parseFloat(computed.width),
      };
    });
    expect(styles.visibility).toBe("visible");
    expect(styles.display).toBe("block");
    expect(styles.width).toBeGreaterThan(0);
  });

  test("Scenario 2: Responsive comparison - geo link is hidden on desktop, visible on mobile", async ({
    page,
  }) => {
    // 1. Desktop viewport (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse, toulouse");

    await page.locator(".photon-autocomplete li").first().click();
    const marker = page.locator(".leaflet-marker-icon").first();
    await marker.click();

    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();

    const desktopGeoLink = popup.locator("a.geo");
    // On desktop, .geo has visibility: hidden and width: 0
    const desktopStyles = await desktopGeoLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        visibility: computed.visibility,
        width: parseFloat(computed.width),
      };
    });
    expect(desktopStyles.visibility).toBe("hidden");
    expect(desktopStyles.width).toBe(0);

    // 2. Resize to mobile viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileStyles = await desktopGeoLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        visibility: computed.visibility,
        display: computed.display,
        width: parseFloat(computed.width),
      };
    });
    expect(mobileStyles.visibility).toBe("visible");
    expect(mobileStyles.display).toBe("block");
    expect(mobileStyles.width).toBeGreaterThan(0);
  });

  test("Scenario 3: Multiple points on mobile provide their respective geo: navigation URLs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("./");

    // Search query returning 2 points
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue");

    const markers = page.locator(".leaflet-marker-icon");
    await expect(markers).toHaveCount(2);

    // Click 1st marker
    await markers.nth(0).click({ force: true });
    const popup1 = page.locator(".leaflet-popup-content");
    await expect(popup1).toBeVisible();
    await expect(popup1.locator("a.geo")).toHaveAttribute(
      "href",
      "geo:43.582,1.397",
    );

    // Pan map to 2nd marker so it is in view on mobile
    await page.evaluate(() => {
      const map = (window as any).map;
      map.panTo([43.599, 1.442], { animate: false });
    });
    await markers.nth(1).click();
    const popup2 = page
      .locator(".leaflet-popup-content")
      .filter({ hasText: "14 Rue de la République" });
    await expect(popup2).toBeVisible();
    await expect(popup2.locator("a.geo")).toHaveAttribute(
      "href",
      "geo:43.599,1.442",
    );
  });

  test("Scenario 4: Direct tap on a real-time point without selecting autocomplete opens geo link", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("./");

    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse, toulouse");

    // While autocomplete is open, tap directly on the map marker
    const marker = page.locator(".leaflet-marker-icon").first();
    await expect(marker).toBeVisible();
    await marker.click({ force: true });

    // Popup opens with geo link
    const geoLink = page.locator(".leaflet-popup-content a.geo");
    await expect(geoLink).toBeVisible();
    await expect(geoLink).toHaveAttribute("href", "geo:43.582,1.397");
  });
});
