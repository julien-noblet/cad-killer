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
  test("Scenario 7: Ctrl+P generates landscape map image and triggers print of identical base map", async ({
    page,
  }) => {
    await page.goto("./#16/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();
    await page.waitForFunction(
      () =>
        (window as any).map &&
        (window as any).map.getSize().x > 0 &&
        document.querySelectorAll(".leaflet-tile-pane img").length > 0,
    );
    await page.waitForTimeout(500);

    // Mock window.print to observe invocation
    await page.evaluate(() => {
      (window as any).printInvoked = false;
      window.print = () => {
        (window as any).printInvoked = true;
      };
    });

    // Press Ctrl+P
    await page.keyboard.press("Control+p");
    await page.waitForFunction(() => (window as any).printInvoked === true);

    // Verify image was generated in #print-container
    const printContainer = page.locator("#print-container");
    const printImg = page.locator("#print-image");

    const imageInfo = await printImg.evaluate((img: HTMLImageElement) => ({
      hasSrc: img.src.startsWith("data:image/png"),
      srcLength: img.src.length,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      isLandscape: img.naturalWidth >= img.naturalHeight,
    }));

    // 1. Image is generated as a valid PNG data URL
    expect(imageInfo.hasSrc).toBe(true);
    expect(imageInfo.srcLength).toBeGreaterThan(1000);

    // 2. Format is landscape (width >= height)
    expect(imageInfo.isLandscape).toBe(true);

    // 3. Emulate print media and verify #print-container visibility and layout
    await page.emulateMedia({ media: "print" });
    const printContainerDisplay = await printContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        position: style.position,
        zIndex: parseInt(style.zIndex, 10),
      };
    });

    expect(printContainerDisplay.display).toBe("flex");
    expect(printContainerDisplay.position).toBe("fixed");
    expect(printContainerDisplay.zIndex).toBeGreaterThanOrEqual(1000);

    // 4. Restore screen mode
    await page.emulateMedia({ media: "screen" });
    const screenContainerDisplay = await printContainer.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    expect(screenContainerDisplay).toBe("none");
  });
});
