import { test, expect } from "@playwright/test";

test.describe("Layers and maximum zoom levels", () => {
  test("OpenStreetMap France reaches max zoom 20", async ({ page }) => {
    await page.goto("./#6/46.495/2.201");
    await expect(page.locator("#map")).toBeVisible();

    const maxZoom = await page.evaluate(() => (window as any).map.getMaxZoom());
    expect(maxZoom).toBe(20);

    // Zoom to max zoom 20
    await page.evaluate(() => (window as any).map.setZoom(20));
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveClass(
      /leaflet-disabled/,
    );

    const currentZoom = await page.evaluate(() =>
      (window as any).map.getZoom(),
    );
    expect(currentZoom).toBe(20);

    // Attempting to zoom further stays clamped at 20
    await page.locator(".leaflet-control-zoom-in").click({ force: true });
    const zoomAfterClick = await page.evaluate(() =>
      (window as any).map.getZoom(),
    );
    expect(zoomAfterClick).toBe(20);
  });

  test("OpenStreetMap standard reaches max zoom 19", async ({ page }) => {
    await page.goto("./#18/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    const osmRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "OpenStreetMap" })
      .filter({ hasNotText: "France" })
      .locator("input[type='radio']");

    await osmRadio.check();
    await expect(osmRadio).toBeChecked();

    const maxZoom = await page.evaluate(() => (window as any).map.getMaxZoom());
    expect(maxZoom).toBe(19);

    // Zoom to 19
    await page.evaluate(() => (window as any).map.setZoom(19));
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveClass(
      /leaflet-disabled/,
    );
    expect(await page.evaluate(() => (window as any).map.getZoom())).toBe(19);
  });

  test("Cadastre base layer reaches max zoom 22", async ({ page }) => {
    await page.goto("./#16/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    const cadastreRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Cadastre" })
      .locator("input[type='radio']");

    await cadastreRadio.check();
    await expect(cadastreRadio).toBeChecked();

    const minZoom = await page.evaluate(() => (window as any).map.getMinZoom());
    const maxZoom = await page.evaluate(() => (window as any).map.getMaxZoom());
    expect(minZoom).toBe(16);
    expect(maxZoom).toBe(22);

    // Zoom to maximum zoom 22
    await page.evaluate(() => (window as any).map.setZoom(22));
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveClass(
      /leaflet-disabled/,
    );
    expect(await page.evaluate(() => (window as any).map.getZoom())).toBe(22);
  });

  test("Esri World Imagery reaches max zoom 18", async ({ page }) => {
    await page.goto("./#16/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    const esriRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Esri" })
      .locator("input[type='radio']");

    await esriRadio.check();
    await expect(esriRadio).toBeChecked();

    const maxZoom = await page.evaluate(() => (window as any).map.getMaxZoom());
    expect(maxZoom).toBe(18);

    await page.evaluate(() => (window as any).map.setZoom(18));
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveClass(
      /leaflet-disabled/,
    );
    expect(await page.evaluate(() => (window as any).map.getZoom())).toBe(18);
  });

  test("World Street Map reaches max zoom 18", async ({ page }) => {
    await page.goto("./#16/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    const worldStreetRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "World Street Map" })
      .locator("input[type='radio']");

    await worldStreetRadio.check();
    await expect(worldStreetRadio).toBeChecked();

    const maxZoom = await page.evaluate(() => (window as any).map.getMaxZoom());
    expect(maxZoom).toBe(18);

    await page.evaluate(() => (window as any).map.setZoom(18));
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveClass(
      /leaflet-disabled/,
    );
    expect(await page.evaluate(() => (window as any).map.getZoom())).toBe(18);
  });

  test("Cadastre overlay: disabled below zoom 16, functional up to zoom 22", async ({
    page,
  }) => {
    // Start below minZoom (zoom 15)
    await page.goto("./#15/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    const cadastreOverlay = page
      .locator(".leaflet-control-layers-overlays label")
      .filter({ hasText: "Cadastre" })
      .locator("input[type='checkbox']");

    // Disabled at zoom 15
    await expect(cadastreOverlay).toBeDisabled();

    // Zoom in to 16
    await page.evaluate(() => (window as any).map.setZoom(16));
    await expect(cadastreOverlay).toBeEnabled();

    // Check overlay
    await cadastreOverlay.check();
    await expect(cadastreOverlay).toBeChecked();

    // Combined with OSMfr (maxZoom 20), overlayCadastre has maxZoom 22, so map maxZoom expands to 22
    const maxZoom = await page.evaluate(() => (window as any).map.getMaxZoom());
    expect(maxZoom).toBe(22);

    // Zoom all the way to 22
    await page.evaluate(() => (window as any).map.setZoom(22));
    expect(await page.evaluate(() => (window as any).map.getZoom())).toBe(22);
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveClass(
      /leaflet-disabled/,
    );
  });

  test("Disables layer selectors when zoom exceeds their maxZoom or falls below minZoom", async ({
    page,
  }) => {
    // At zoom 20: OSMfr is enabled, Cadastre is enabled, but OSM, Esri, World Street are disabled
    await page.goto("./#20/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    const osmFrRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "OpenStreetMap France" })
      .locator("input[type='radio']");
    const osmRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "OpenStreetMap" })
      .filter({ hasNotText: "France" })
      .locator("input[type='radio']");
    const esriRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Esri" })
      .locator("input[type='radio']");
    const worldStreetRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "World Street Map" })
      .locator("input[type='radio']");
    const cadastreRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Cadastre" })
      .locator("input[type='radio']");

    await expect(osmFrRadio).toBeEnabled();
    await expect(cadastreRadio).toBeEnabled();
    await expect(osmRadio).toBeDisabled();
    await expect(esriRadio).toBeDisabled();
    await expect(worldStreetRadio).toBeDisabled();

    // At zoom 21 (only available under Cadastre): OSMfr also becomes disabled
    await cadastreRadio.check();
    await page.evaluate(() => (window as any).map.setZoom(21));
    await expect(cadastreRadio).toBeEnabled();
    await expect(osmFrRadio).toBeDisabled();

    // Switch back to OSMfr at zoom 16, then zoom to 15 (below Cadastre minZoom 16)
    await page.evaluate(() => (window as any).map.setZoom(16));
    await osmFrRadio.check();
    await page.evaluate(() => (window as any).map.setZoom(15));
    await expect(cadastreRadio).toBeDisabled();
    await expect(osmFrRadio).toBeEnabled();
    await expect(osmRadio).toBeEnabled();
    await expect(esriRadio).toBeEnabled();
  });

  test("Switches layers at common zoom and verifies tile URLs at maximum zoom", async ({
    page,
  }) => {
    const tileRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("tile") ||
        url.includes("cadastre") ||
        url.includes("arcgisonline")
      ) {
        tileRequests.push(url);
      }
    });

    // 1. OSM France at zoom 20
    await page.goto("./#20/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();
    await expect
      .poll(() => tileRequests.some((u) => u.includes("/osmfr/20/")))
      .toBe(true);

    // 2. Switch to Cadastre base layer and zoom to 22
    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();
    const cadastreRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Cadastre" })
      .locator("input[type='radio']");
    await cadastreRadio.check();
    await page.evaluate(() => (window as any).map.setZoom(22));
    await expect
      .poll(() => tileRequests.some((u) => u.includes("/tout/22/")))
      .toBe(true);

    // 3. Switch to OSM standard at zoom 18 and zoom to 19
    await page.evaluate(() => (window as any).map.setZoom(18));
    await layerControl.hover();
    const osmRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "OpenStreetMap" })
      .filter({ hasNotText: "France" })
      .locator("input[type='radio']");
    await osmRadio.check();
    await page.evaluate(() => (window as any).map.setZoom(19));
    await expect
      .poll(() =>
        tileRequests.some((u) => u.includes(".openstreetmap.org/19/")),
      )
      .toBe(true);
  });
});
