import { test, expect, type Page } from "@playwright/test";

function mockReverseApi(page: Page) {
  return page.route("**/geocodage/reverse/**", async (route) => {
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
              label: "14 Rue Michel Labrousse, 31100 Toulouse",
              name: "14 Rue Michel Labrousse",
              type: "housenumber",
            },
          },
        ],
      }),
    });
  });
}

test.describe("Print view specifications", () => {
  test("Scenario 1: Print page format is configured as landscape with 0 margin", async ({
    page,
  }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    // Inspect @page CSS rule in document stylesheets
    const pageRule = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (
              rule instanceof CSSMediaRule &&
              rule.conditionText === "print"
            ) {
              for (const inner of Array.from(rule.cssRules)) {
                if (inner instanceof CSSPageRule) {
                  return inner.style.cssText;
                }
              }
            } else if (rule instanceof CSSPageRule) {
              return rule.style.cssText;
            }
          }
        } catch {
          // Ignore cross-origin sheets
        }
      }
      return null;
    });

    expect(pageRule).toContain("size: landscape");
    expect(pageRule).toContain("margin: 0");
  });

  test("Scenario 2: Reverse label is unique, positioned at the top, and in large text in print view", async ({
    page,
  }) => {
    await mockReverseApi(page);
    await page.goto("./#16/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const reverseLabel = page.locator(".reverse-label");
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «14 Rue Michel Labrousse, 31100 Toulouse»",
    );

    // Ensure there is strictly one reverse label on the page
    await expect(reverseLabel).toHaveCount(1);

    // Emulate print preview
    await page.emulateMedia({ media: "print" });

    // Verify print positioning and styling
    const printStyles = await reverseLabel.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        top: computed.top,
        fontSize: parseFloat(computed.fontSize),
        visibility: computed.visibility,
        rectTop: rect.top,
      };
    });

    // 1. Visible
    expect(printStyles.visibility).toBe("visible");
    // 2. Positioned at the very top (top: 0, rect.top <= 2)
    expect(printStyles.top).toBe("0px");
    expect(printStyles.rectTop).toBeLessThanOrEqual(2);
    // 3. Displayed in large font (font-size: x-large >= 20px, usually 24px)
    expect(printStyles.fontSize).toBeGreaterThanOrEqual(20);
    // 4. Text content remains accurate
    await expect(reverseLabel).toHaveText(
      "Carte centrée sur «14 Rue Michel Labrousse, 31100 Toulouse»",
    );
  });

  test("Scenario 3: Tile layer selector is hidden in print view", async ({
    page,
  }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await expect(layerControl).toBeVisible();

    // Emulate print
    await page.emulateMedia({ media: "print" });

    const layerVisibility = await layerControl.evaluate(
      (el) => window.getComputedStyle(el).visibility,
    );
    expect(layerVisibility).toBe("hidden");
  });

  test("Scenario 4: Searchbox (Photon control) is hidden in print view", async ({
    page,
  }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    const searchInput = page.locator(".photon-input");
    await expect(searchInput).toBeVisible();

    // Emulate print
    await page.emulateMedia({ media: "print" });

    const searchVisibility = await searchInput.evaluate(
      (el) => window.getComputedStyle(el).visibility,
    );
    expect(searchVisibility).toBe("hidden");
  });

  test("Scenario 5: Switching back to screen restores interactive controls and layout", async ({
    page,
  }) => {
    await mockReverseApi(page);
    await page.goto("./#16/43.582/1.397");

    const layerControl = page.locator(".leaflet-control-layers");
    const searchInput = page.locator(".photon-input");
    const reverseLabel = page.locator(".reverse-label");

    // Print mode
    await page.emulateMedia({ media: "print" });
    expect(
      await layerControl.evaluate(
        (el) => window.getComputedStyle(el).visibility,
      ),
    ).toBe("hidden");
    expect(
      await searchInput.evaluate(
        (el) => window.getComputedStyle(el).visibility,
      ),
    ).toBe("hidden");

    // Restore screen mode
    await page.emulateMedia({ media: "screen" });
    expect(
      await layerControl.evaluate(
        (el) => window.getComputedStyle(el).visibility,
      ),
    ).toBe("visible");
    expect(
      await searchInput.evaluate(
        (el) => window.getComputedStyle(el).visibility,
      ),
    ).toBe("visible");

    // Reverse label returns to standard screen font and position
    const screenStyles = await reverseLabel.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        bottom: computed.bottom,
        fontSize: parseFloat(computed.fontSize),
      };
    });
    expect(screenStyles.bottom).toBe("0px");
    expect(screenStyles.fontSize).toBeLessThan(20);
  });

  test("Scenario 6: Print view below reverse zoom threshold keeps map clean", async ({
    page,
  }) => {
    // Zoom 12 (< threshold 14)
    await page.goto("./#12/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const reverseLabel = page.locator(".reverse-label");
    await expect(reverseLabel).toBeEmpty();

    await page.emulateMedia({ media: "print" });

    // Controls hidden, map visible, reverse label empty
    const map = page.locator("#map");
    await expect(map).toBeVisible();
    await expect(reverseLabel).toBeEmpty();

    const layerVisibility = await page
      .locator(".leaflet-control-layers")
      .evaluate((el) => window.getComputedStyle(el).visibility);
    expect(layerVisibility).toBe("hidden");

    const searchVisibility = await page
      .locator(".photon-input")
      .evaluate((el) => window.getComputedStyle(el).visibility);
    expect(searchVisibility).toBe("hidden");
  });
});
