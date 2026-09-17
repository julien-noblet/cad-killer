import { test, expect } from "@playwright/test";

test.describe("Map controls and display", () => {
  test("displays layer control, switches base layers, and toggles overlays", async ({
    page,
  }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await expect(layerControl).toBeVisible();

    const layerToggle = page.locator(".leaflet-control-layers-toggle");
    await expect(layerToggle).toBeVisible();
    await expect(layerToggle).toHaveAttribute("title", "Fonds de carte");
    const toggleBox = await layerToggle.boundingBox();
    expect(toggleBox?.width).toBeGreaterThanOrEqual(30);
    expect(toggleBox?.height).toBeGreaterThanOrEqual(30);

    // Hover to expand layers list
    await layerControl.hover();
    const layerList = page.locator(".leaflet-control-layers-list");
    await expect(layerList).toBeVisible();

    // Verify section titles rendered via pseudo-elements
    const baseHeader = await page.evaluate(() => {
      const el = document.querySelector(".leaflet-control-layers-base");
      return el ? window.getComputedStyle(el, "::before").content : null;
    });
    expect(baseHeader).toContain("Fonds de carte");

    // Check base layers
    const baseLabels = page.locator(".leaflet-control-layers-base label span");
    const baseTexts = await baseLabels.allInnerTexts();
    expect(baseTexts.some((t) => t.includes("OpenStreetMap France"))).toBe(
      true,
    );
    expect(baseTexts.some((t) => t.includes("OpenStreetMap"))).toBe(true);
    expect(baseTexts.some((t) => t.includes("Cadastre"))).toBe(true);
    expect(baseTexts.some((t) => t.includes("Esri"))).toBe(true);

    // Check overlay layers
    const overlayLabels = page.locator(
      ".leaflet-control-layers-overlays label span",
    );
    const overlayTexts = await overlayLabels.allInnerTexts();
    expect(overlayTexts.some((t) => t.includes("Cadastre"))).toBe(true);

    // Switch base layer to Esri
    const esriRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Esri" })
      .locator("input[type='radio']");
    await esriRadio.check();
    await expect(esriRadio).toBeChecked();

    // Cadastre has minZoom 16, so it is disabled at initial zoom 6
    const cadastreCheckbox = page
      .locator(".leaflet-control-layers-overlays label")
      .filter({ hasText: "Cadastre" })
      .locator("input[type='checkbox']");
    await expect(cadastreCheckbox).toBeDisabled();

    // Zoom to 16 and verify Cadastre becomes enabled and can be checked
    await page.evaluate(() => {
      const map = (window as any).map;
      map.setZoom(16);
    });
    await expect(cadastreCheckbox).toBeEnabled();
    await cadastreCheckbox.check();
    await expect(cadastreCheckbox).toBeChecked();
  });

  test("displays required map attributions", async ({ page }) => {
    await page.goto("./");
    const attribution = page.locator(".leaflet-control-attribution");
    await expect(attribution).toBeVisible();
    await expect(attribution).toContainText("Contributeurs de OpenStreetMap");
    await expect(attribution).toContainText("Adresses BAN");
    await expect(attribution).toContainText("ODbL");
  });

  test("maintains map visibility in print preview", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    await page.emulateMedia({ media: "print" });
    const map = page.locator("#map");
    await expect(map).toBeVisible();

    await page.emulateMedia({ media: "screen" });
    await expect(map).toBeVisible();
  });
});
