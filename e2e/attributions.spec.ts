import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  smallMobile: { width: 320, height: 568 },
};

async function assertAttributionVisibilityAndContent(page: Page) {
  const attribution = page.locator(".leaflet-control-attribution");
  await expect(attribution).toBeVisible();

  // Verify mandatory credits
  await expect(attribution).toContainText("Contributeurs de OpenStreetMap");
  await expect(attribution).toContainText("Adresses BAN");
  await expect(attribution).toContainText("ODbL");

  // Verify links have valid targets
  const osmLink = attribution.locator('a[href*="openstreetmap.org"]');
  await expect(osmLink.first()).toBeVisible();

  const banLink = attribution.locator('a[href*="data.gouv.fr"]');
  await expect(banLink).toBeVisible();

  // Verify computed visibility and opacity
  const styles = await attribution.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      visibility: computed.visibility,
      display: computed.display,
      opacity: parseFloat(computed.opacity),
      width: rect.width,
      height: rect.height,
    };
  });

  expect(styles.visibility).toBe("visible");
  expect(styles.display).not.toBe("none");
  expect(styles.opacity).toBeGreaterThan(0);
  expect(styles.width).toBeGreaterThan(50);
  expect(styles.height).toBeGreaterThan(10);
}

test.describe("Map attribution and legal credits in all modes and viewports", () => {
  test("Scenario 1: Visible and readable on Desktop screen (1440x900)", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    await assertAttributionVisibilityAndContent(page);
    await expect(page.locator(".leaflet-control-attribution")).toContainText(
      "OpenStreetMap France",
    );
  });

  test("Scenario 2: Visible and readable on Tablet screen (768x1024)", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    await assertAttributionVisibilityAndContent(page);
  });

  test("Scenario 3: Visible and readable on standard Mobile screen (375x667)", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    await assertAttributionVisibilityAndContent(page);
  });

  test("Scenario 4: Visible and readable on small Mobile screen (320x568)", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.smallMobile);
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    await assertAttributionVisibilityAndContent(page);
  });

  test("Scenario 5: Visible in print preview mode on Desktop", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    await assertAttributionVisibilityAndContent(page);

    // Verify map is still visible behind attribution
    await expect(page.locator("#map")).toBeVisible();
  });

  test("Scenario 6: Visible in print preview mode on Mobile", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("./");
    await expect(page.locator("#map")).toBeVisible();

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    await assertAttributionVisibilityAndContent(page);
  });

  test("Scenario 7: Dynamic attribution updates when switching layers across screen & print modes", async ({
    page,
  }) => {
    await page.goto("./#16/43.582/1.397");
    await expect(page.locator("#map")).toBeVisible();

    const layerControl = page.locator(".leaflet-control-layers");
    await layerControl.hover();

    // 1. Switch to Cadastre: attribution includes Cadastre
    const cadastreRadio = page
      .locator(".leaflet-control-layers-base label")
      .filter({ hasText: "Cadastre" })
      .locator("input[type='radio']");
    await cadastreRadio.check();

    const attribution = page.locator(".leaflet-control-attribution");
    await expect(attribution).toContainText("Cadastre");
    await assertAttributionVisibilityAndContent(page);

    // 2. Switch to Esri: attribution includes Esri
    await esriSwitch(page);
    await expect(attribution).toContainText("Esri");
    await assertAttributionVisibilityAndContent(page);

    // 3. Emulate print with Esri active: credits remain visible
    await page.emulateMedia({ media: "print" });
    await expect(attribution).toContainText("Esri");
    await assertAttributionVisibilityAndContent(page);
  });
});

async function esriSwitch(page: Page) {
  const layerControl = page.locator(".leaflet-control-layers");
  await layerControl.hover();
  const esriRadio = page
    .locator(".leaflet-control-layers-base label")
    .filter({ hasText: "Esri" })
    .locator("input[type='radio']");
  await esriRadio.check();
}
