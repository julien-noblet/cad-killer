const timeout = 60 * 1000 * 20;
const allDevices = require('./e2e-devices');
const devices = allDevices.slice(30, 40);

describe("E2E Tests - Responsive Chunk 4", () => {
    let page;

    beforeAll(async () => {
        page = await globalThis.__BROWSER_GLOBAL__.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }, timeout);

    afterAll(async () => {
        if (page) await page.close();
    });

    test("Responsive Tests (Devices 31-40)", async () => {
        for (const device of devices) {
            await page.setViewport(device.viewport);
            await page.goto("http://localhost:9000/");

            // Basic assertion
            const header = await page.$("#head");
            expect(header).toBeTruthy();

            // Wait for tiles
            await page.waitForNetworkIdle({ idleTime: 2000 });
            await page.waitForFunction(() => {
                const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
                return tiles.length > 0 && tiles.every(img => img.complete);
            }, { timeout: 10000 });

            // Wait for fonts to be ready
            await page.waitForFunction("document.fonts.status === 'loaded'");

            // Visual Regression
            const screenshot = await page.screenshot();
            expect(screenshot).toMatchImageSnapshot({
                customSnapshotIdentifier: `responsive_${device.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
                failureThreshold: 0.01,
                failureThresholdType: 'percent',
                customDiffConfig: { threshold: 0.1 }
            });
        }
    }, timeout);
});
