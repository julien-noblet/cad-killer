import { test, expect } from "@playwright/test";

function mockReverseApi(page: import("@playwright/test").Page) {
  return page.route("**/geocodage/reverse/**", async (route) => {
    const url = new URL(route.request().url());
    const lat = parseFloat(url.searchParams.get("lat") || "0");
    const lon = parseFloat(url.searchParams.get("lon") || "0");

    let label: string;
    // Toulouse Labrousse area (~43.582, 1.397)
    if (Math.abs(lat - 43.582) < 0.002 && Math.abs(lon - 1.397) < 0.002) {
      label = "14 Rue Michel Labrousse, 31100 Toulouse";
    }
    // Toulouse Capitole area (~43.604, 1.444)
    else if (Math.abs(lat - 43.604) < 0.002 && Math.abs(lon - 1.444) < 0.002) {
      label = "Place du Capitole, 31000 Toulouse";
    }
    // Paris Rue de la Paix area (~48.869, 2.330)
    else if (Math.abs(lat - 48.869) < 0.002 && Math.abs(lon - 2.33) < 0.002) {
      label = "10 Rue de la Paix, 75002 Paris";
    } else {
      label = `${Math.round(lat * 1000) / 1000}, ${Math.round(lon * 1000) / 1000}`;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            properties: {
              label,
              name: label.split(",")[0],
              type: "housenumber",
            },
          },
        ],
      }),
    });
  });
}

test.describe("Reverse geocoding when moving the map", () => {
  test.beforeEach(async ({ page }) => {
    await mockReverseApi(page);
  });

  test("Scenario 1: Dragging the map with mouse updates reverse label with new address", async ({
    page,
  }) => {
    // Start centered on Toulouse Capitole at zoom 16
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([43.604, 1.444], 16);
    });

    const reverseLabel = page.locator(".reverse-label");
    await expect(reverseLabel).toBeVisible();
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «Place du Capitole, 31000 Toulouse»",
    );

    // Header remains visible
    await expect(page.locator("#head h1")).toBeVisible();

    // Drag the map with mouse significantly to change the center
    const mapBox = await page.locator("#map").boundingBox();
    expect(mapBox).toBeTruthy();
    if (mapBox) {
      const startX = mapBox.x + mapBox.width * 0.75;
      const startY = mapBox.y + mapBox.height * 0.75;
      const targetX = mapBox.x + mapBox.width * 0.25;
      const targetY = mapBox.y + mapBox.height * 0.25;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(targetX, targetY, { steps: 10 });
      await page.mouse.up();
    }

    // After drag moveend, reverse label updates with new location coordinates
    await expect(reverseLabel).toBeVisible();
    await expect(reverseLabel).not.toHaveText(
      "Carte centrée sur «Place du Capitole, 31000 Toulouse»",
    );
    await expect(reverseLabel).toContainText("Carte centrée sur «");
  });

  test("Scenario 2: Sequential pan movements update reverse label to exact target addresses", async ({
    page,
  }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([43.582, 1.397], 16);
    });

    const reverseLabel = page.locator(".reverse-label");

    // Location 1: 14 Rue Michel Labrousse, Toulouse
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «14 Rue Michel Labrousse, 31100 Toulouse»",
    );

    // Pan to Location 2: Place du Capitole, Toulouse
    await page.evaluate(() => {
      const map = (window as any).map;
      map.panTo([43.604, 1.444]);
    });

    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «Place du Capitole, 31000 Toulouse»",
    );

    // Pan to Location 3: 10 Rue de la Paix, Paris
    await page.evaluate(() => {
      const map = (window as any).map;
      map.panTo([48.869, 2.33]);
    });

    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «10 Rue de la Paix, 75002 Paris»",
    );
  });

  test("Scenario 3: Zoom threshold controls reverse display during movements", async ({
    page,
  }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    // 1. Zoom 14 (boundary): reverse is NOT active
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([43.604, 1.444], 14);
    });

    const reverseLabel = page.locator(".reverse-label");
    await expect(reverseLabel).toBeEmpty();
    await expect(page.locator("#head h1")).toBeVisible();

    // Panning at zoom 14 should NOT activate reverse
    await page.evaluate(() => {
      const map = (window as any).map;
      map.panTo([43.582, 1.397], { animate: false });
    });
    await expect(reverseLabel).toBeEmpty();

    // 2. Zoom in to 15 (> threshold 14): reverse activates immediately
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setZoom(15);
    });
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «14 Rue Michel Labrousse, 31100 Toulouse»",
    );
    await expect(page.locator("#head h1")).toBeVisible();

    // 3. Zoom out to 12: label clears
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setZoom(12);
    });
    await expect(reverseLabel).toBeEmpty();

    // 4. Zoom back in to 16 at Capitole: reverse re-triggers
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([43.604, 1.444], 16);
    });
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «Place du Capitole, 31000 Toulouse»",
    );
  });

  test("Scenario 4: Validates query parameters sent to reverse geocoding API", async ({
    page,
  }) => {
    let capturedParams: { lat: string | null; lon: string | null } | null =
      null;
    page.on("request", (req) => {
      if (req.url().includes("/geocodage/reverse/")) {
        const u = new URL(req.url());
        capturedParams = {
          lat: u.searchParams.get("lat"),
          lon: u.searchParams.get("lon"),
        };
      }
    });

    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setView([43.582, 1.397], 16);
    });

    await expect
      .poll(() => capturedParams)
      .toEqual({
        lat: expect.stringMatching(/^43\.58/),
        lon: expect.stringMatching(/^1\.39/),
      });
  });

  test("Scenario 5: Search selection triggers reverse geocoding on arrival", async ({
    page,
  }) => {
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
                type: "housenumber",
              },
            },
          ],
        }),
      });
    });

    // Start at initial default view where reverse is inactive
    await page.goto("./");
    const reverseLabel = page.locator(".reverse-label");
    await expect(reverseLabel).toBeEmpty();

    // Type address in search box and click suggestion
    const searchInput = page.locator(".photon-input");
    await searchInput.fill("14 rue michel labrousse");
    const suggestion = page.locator(".photon-autocomplete li").first();
    await expect(suggestion).toBeVisible();
    await suggestion.click();

    // On arrival at zoom 18, reverse geocode automatically fires and displays the label
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «14 Rue Michel Labrousse, 31100 Toulouse»",
    );
  });
});
