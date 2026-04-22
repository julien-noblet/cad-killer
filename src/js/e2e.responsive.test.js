const timeout = 60 * 1000 * 20;
const allDevices = require("./e2e-devices");
const describeE2E = globalThis.__BROWSER_GLOBAL__ ? describe : describe.skip;

describeE2E("E2E Tests - Responsive Chunk 1", () => {
  let page;

  beforeEach(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  }, timeout);

  afterEach(async () => {
    if (page) await page.close();
    page = null;
  });

  for (const device of allDevices) {
    const deviceName = device.name;
    const viewport = device.viewport;

    test(
      `Responsive Test: ${deviceName} (${viewport.width}x${viewport.height})`,
      async () => {
        await page.setViewport(viewport);
        await page.goto("http://localhost:9000/");

        const header = await page.$("#head");
        expect(header).toBeTruthy();

        await page.waitForNetworkIdle({ idleTime: 2000 });
        await page.waitForFunction(
          () => {
            const tiles = Array.from(
              document.querySelectorAll(".leaflet-tile"),
            );
            return tiles.length > 0 && tiles.every((img) => img.complete);
          },
          { timeout: 10000 },
        );

        await page.waitForFunction(
          () =>
            document.fonts.check("12px open_sansregular") &&
            document.fonts.check("12px Material-Design-Iconic-Font"),
          { timeout: 10000 },
        );

        const screenshot = await page.screenshot();
        expect(screenshot).toMatchImageSnapshot({
          customSnapshotIdentifier: `responsive_${deviceName.replace(/[^a-zA-Z0-9]/g, "_")}`,
          failureThreshold: 0.03,
          failureThresholdType: "percent",
          customDiffConfig: { threshold: 0.1 },
        });
      },
      timeout,
    );
  }
});
