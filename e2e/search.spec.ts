import { test, expect, type Page } from "@playwright/test";

const TOULOUSE_LABROUSSE = {
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [1.397, 43.582] },
  properties: {
    label: "14 Rue Michel Labrousse 31100 Toulouse",
    name: "14 Rue Michel Labrousse",
    city: "Toulouse",
    context: "31, Haute-Garonne, Occitanie",
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
    context: "31, Haute-Garonne, Occitanie",
    type: "housenumber" as const,
  },
};

const TOULOUSE_METZ = {
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [1.448, 43.6] },
  properties: {
    label: "14 Rue de Metz 31000 Toulouse",
    name: "14 Rue de Metz",
    city: "Toulouse",
    context: "31, Haute-Garonne, Occitanie",
    type: "housenumber" as const,
  },
};

function getMapState(page: Page) {
  return page.evaluate(() => {
    const map = (window as unknown as { map?: import("leaflet").Map }).map;
    if (!map) return null;
    const center = map.getCenter();
    return {
      lat: Math.round(center.lat * 1000) / 1000,
      lng: Math.round(center.lng * 1000) / 1000,
      zoom: map.getZoom(),
    };
  });
}

test.describe("Search functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Dynamic mock for geocoding search API
    await page.route("**/geocodage/search/**", async (route) => {
      const url = new URL(route.request().url());
      const query = (url.searchParams.get("q") || "").toLowerCase();

      let features: (typeof TOULOUSE_LABROUSSE)[] = [];
      if (query.includes("labrousse")) {
        features = [TOULOUSE_LABROUSSE];
      } else if (query.includes("14 rue")) {
        features = [TOULOUSE_LABROUSSE, TOULOUSE_REPUBLIQUE, TOULOUSE_METZ];
      } else if (query === "y") {
        features = [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [3.083, 49.667] },
            properties: {
              label: "Y 80190",
              name: "Y",
              city: "Y",
              context: "80, Somme, Hauts-de-France",
              type: "city" as const,
            },
          },
        ];
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
  });

  test("Scenario 1: Progressive typing updates suggestions and renders real-time map markers", async ({
    page,
  }) => {
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    const markers = page.locator(".leaflet-marker-icon");
    const suggestions = page.locator(".photon-autocomplete li");

    // Initially no markers on the map
    await expect(markers).toHaveCount(0);

    // Typing 2 chars (< minChar) does not trigger search
    await searchInput.fill("14");
    await expect(suggestions).toHaveCount(0);
    await expect(markers).toHaveCount(0);

    // Typing "14 rue" returns multiple candidates and displays them in real time
    await searchInput.fill("14 rue");
    await expect(suggestions).toHaveCount(3);
    await expect(suggestions.first()).toContainText("14 Rue Michel Labrousse");
    await expect(markers).toHaveCount(3);

    // Refining to full address narrows suggestions and updates markers in real time
    await searchInput.fill("14 rue michel labrousse, toulouse");
    await expect(suggestions).toHaveCount(1);
    await expect(suggestions.first()).toContainText("14 Rue Michel Labrousse");
    await expect(suggestions.first()).toContainText("Toulouse");
    await expect(markers).toHaveCount(1);
  });

  test("Scenario 2: Validation via mouse click zooms and centers map on target address", async ({
    page,
  }) => {
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse, toulouse");

    const firstResult = page.locator(".photon-autocomplete li").first();
    await expect(firstResult).toBeVisible();

    // Click to select
    await firstResult.click();

    // Autocomplete closes and input resets
    await expect(searchInput).toHaveValue("");

    // Map centers on 14 rue Michel Labrousse [43.582, 1.397] with housenumber zoom (18)
    await expect
      .poll(async () => getMapState(page))
      .toEqual({
        lat: 43.582,
        lng: 1.397,
        zoom: 18,
      });

    // Clicking the real-time marker on map displays popup with navigation geo: link
    const marker = page.locator(".leaflet-marker-icon").first();
    await expect(marker).toBeVisible();
    await marker.click();

    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("14 Rue Michel Labrousse");
    await expect(popup.locator("a.geo")).toHaveAttribute(
      "href",
      "geo:43.582,1.397",
    );
  });

  test("Scenario 3: Validation via keyboard navigation (ArrowDown + Enter)", async ({
    page,
  }) => {
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue");

    const suggestions = page.locator(".photon-autocomplete li");
    await expect(suggestions).toHaveCount(3);
    // Default highlight on first result
    await expect(suggestions.nth(0)).toHaveClass(/on/);

    // Arrow down moves highlight to second item (14 Rue de la République)
    await searchInput.press("ArrowDown");
    await expect(suggestions.nth(1)).toHaveClass(/on/);

    // Validate selection with Enter
    await searchInput.press("Enter");

    // Map centers on second result coordinates [43.599, 1.442]
    await expect
      .poll(async () => getMapState(page))
      .toEqual({
        lat: 43.599,
        lng: 1.442,
        zoom: 18,
      });
  });

  test("Scenario 4: Validation via direct Enter key selects top suggestion", async ({
    page,
  }) => {
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse, toulouse");

    const suggestions = page.locator(".photon-autocomplete li");
    await expect(suggestions).toHaveCount(1);

    // Press Enter directly without using arrow keys
    await searchInput.press("Enter");

    // Map centers on top suggestion
    await expect
      .poll(async () => getMapState(page))
      .toEqual({
        lat: 43.582,
        lng: 1.397,
        zoom: 18,
      });
  });

  test("Scenario 5: Clicking directly on a real-time map marker zooms and shows popup", async ({
    page,
  }) => {
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse, toulouse");

    // Wait for the marker to appear on the map in real time
    const marker = page.locator(".leaflet-marker-icon").first();
    await expect(marker).toBeVisible();

    // Click directly on the marker icon
    await marker.click();

    // Map zooms to target
    await expect
      .poll(async () => getMapState(page))
      .toEqual({
        lat: 43.582,
        lng: 1.397,
        zoom: 18,
      });

    // Marker popup is displayed with label and coordinates
    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("14 Rue Michel Labrousse");
  });

  test("Scenario 6: Fast 2-character commune search for short city names", async ({
    page,
  }) => {
    await page.goto("./");
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("y");

    const firstResult = page.locator(".photon-autocomplete li").first();
    await expect(firstResult).toBeVisible();
    await expect(firstResult).toContainText("Y");

    // Marker rendered on map for the short city
    await expect(page.locator(".leaflet-marker-icon")).toHaveCount(1);
  });
});
