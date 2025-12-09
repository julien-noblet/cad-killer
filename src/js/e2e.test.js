const timeout = 60 * 1000 * 20; // 20 minutes

// Top 50 Common Resolutions / Devices
const devices = [
    // Mobile
    { name: "iPhone SE", viewport: { width: 375, height: 667 } },
    { name: "iPhone XR", viewport: { width: 414, height: 896 } },
    { name: "iPhone 12 Pro", viewport: { width: 390, height: 844 } },
    { name: "iPhone 14 Pro Max", viewport: { width: 430, height: 932 } },
    { name: "Pixel 7", viewport: { width: 412, height: 915 } },
    { name: "Samsung Galaxy S8", viewport: { width: 360, height: 740 } },
    { name: "Samsung Galaxy S20 Ultra", viewport: { width: 412, height: 915 } },
    { name: "iPad Mini", viewport: { width: 768, height: 1024 } },
    { name: "iPad Air", viewport: { width: 820, height: 1180 } },
    { name: "iPad Pro", viewport: { width: 1024, height: 1366 } },
    { name: "Surface Pro 7", viewport: { width: 912, height: 1368 } },
    // Desktop / Laptop
    { name: "Laptop 1366x768", viewport: { width: 1366, height: 768 } },
    { name: "Laptop 1920x1080", viewport: { width: 1920, height: 1080 } },
    { name: "Laptop 1536x864", viewport: { width: 1536, height: 864 } },
    { name: "Laptop 1440x900", viewport: { width: 1440, height: 900 } },
    { name: "Desktop 1280x720", viewport: { width: 1280, height: 720 } },
    { name: "Desktop 1600x900", viewport: { width: 1600, height: 900 } },
    { name: "Desktop 2560x1440", viewport: { width: 2560, height: 1440 } },
    { name: "Large Desktop 1920x1200", viewport: { width: 1920, height: 1200 } },
    { name: "4K 3840x2160", viewport: { width: 3840, height: 2160 } },
    { name: "Generic 360x640", viewport: { width: 360, height: 640 } },
    { name: "Generic 360x800", viewport: { width: 360, height: 800 } },
    { name: "Generic 390x844", viewport: { width: 390, height: 844 } },
    { name: "Generic 393x873", viewport: { width: 393, height: 873 } },
    { name: "Generic 412x915", viewport: { width: 412, height: 915 } },
    { name: "Generic 414x896", viewport: { width: 414, height: 896 } },
    { name: "Generic 320x568", viewport: { width: 320, height: 568 } },
    { name: "Generic 375x812", viewport: { width: 375, height: 812 } },
    { name: "Generic 428x926", viewport: { width: 428, height: 926 } },
    { name: "Generic 480x854", viewport: { width: 480, height: 854 } },
    { name: "Generic 540x960", viewport: { width: 540, height: 960 } },
    { name: "Generic 600x1024", viewport: { width: 600, height: 1024 } },
    { name: "Generic 720x1280", viewport: { width: 720, height: 1280 } },
    { name: "Generic 800x1280", viewport: { width: 800, height: 1280 } },
    { name: "Generic 768x1024", viewport: { width: 768, height: 1024 } },
    { name: "Generic 1024x768", viewport: { width: 1024, height: 768 } },
    { name: "Generic 1280x800", viewport: { width: 1280, height: 800 } },
    { name: "Generic 1280x1024", viewport: { width: 1280, height: 1024 } },
    { name: "Generic 1360x768", viewport: { width: 1360, height: 768 } },
    { name: "Generic 1400x1050", viewport: { width: 1400, height: 1050 } },
    { name: "Generic 1440x960", viewport: { width: 1440, height: 960 } },
    { name: "Generic 1600x1200", viewport: { width: 1600, height: 1200 } },
    { name: "Generic 1680x1050", viewport: { width: 1680, height: 1050 } },
    { name: "Generic 1920x1440", viewport: { width: 1920, height: 1440 } },
    { name: "Generic 2048x1152", viewport: { width: 2048, height: 1152 } },
    { name: "Generic 2048x1536", viewport: { width: 2048, height: 1536 } },
    { name: "Generic 2560x1080", viewport: { width: 2560, height: 1080 } },
    { name: "Generic 2560x1600", viewport: { width: 2560, height: 1600 } },
    { name: "Generic 3440x1440", viewport: { width: 3440, height: 1440 } },
    { name: "Generic 5120x2880", viewport: { width: 5120, height: 2880 } },
];

describe("E2E Tests", () => {
    let page;

    beforeAll(async () => {
        page = await globalThis.__BROWSER_GLOBAL__.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }, timeout);

    afterAll(async () => {
        if (page) await page.close();
    });

    test.skip("Feature 1: Search for '14 rue Michel Labrousse, Toulouse'", async () => {
        // Mock the search API
        await page.setRequestInterception(true);
        page.on('request', request => {
            console.log('DEBUG REQUEST:', request.url()); // Log all requests
            if (request.url().includes('api-adresse.data.gouv.fr')) {
                console.log('Intercepted Target Request:', request.url());
                request.respond({
                    content: 'application/json',
                    body: JSON.stringify({
                        type: "FeatureCollection",
                        features: [{
                            geometry: { type: 'Point', coordinates: [1.397, 43.582] },
                            properties: {
                                label: "14 Rue Michel Labrousse 31100 Toulouse",
                                name: "14 Rue Michel Labrousse",
                                city: "Toulouse",
                                context: "31, Haute-Garonne, Occitanie",
                                type: "street"
                            }
                        }]
                    })
                });
            } else {
                request.continue();
            }
        });

        await page.goto("http://localhost:9000/");
        const input = await page.waitForSelector(".photon-input");
        await input.type("14 rue Michel Labrousse, Toulouse", { delay: 100 });

        // Force event trigger to ensure photon catches it
        await page.evaluate(() => {
            const input = document.querySelector('.photon-input');
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('keyup', { bubbles: true }));
        });

        // Wait for results
        try {
            await page.waitForSelector(".photon-autocomplete", { timeout: 10000 });
        } catch (e) {
            console.log("Timeout waiting for .photon-autocomplete. HTML:", await page.content());
            throw e;
        }
        const firstResult = await page.waitForSelector(".photon-autocomplete li");
        const text = await page.evaluate(el => el.innerText, firstResult);
        expect(text).toContain("14 Rue Michel Labrousse");

        // Cleanup interception
        await page.setRequestInterception(false);
        page.removeAllListeners('request');
    }, timeout);

    test("Feature 2: Layer Control", async () => {
        await page.goto("http://localhost:9000/");
        const layerControl = await page.waitForSelector(".leaflet-control-layers-toggle");

        // Hover to expand
        await layerControl.hover();
        await page.waitForSelector(".leaflet-control-layers-list", { visible: true });

        const labels = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".leaflet-control-layers-base label span")).map(el => el.innerText.trim());
        });

        const expectedLayers = [
            "OpenStreetMap France",
            "OpenStreetMap"
        ];

        expectedLayers.forEach(layer => {
            expect(labels).toContainEqual(expect.stringContaining(layer));
        });
    }, timeout);

    test("Feature 3: Attribution", async () => {
        await page.goto("http://localhost:9000/");
        const attribution = await page.waitForSelector(".leaflet-control-attribution");
        const html = await page.evaluate(el => el.innerHTML, attribution);

        expect(html).toContain("Contributeurs de OpenStreetMap");
        expect(html).toContain("Adresses BAN");
    }, timeout);

    test("Feature 4: Responsive Tests (50 Devices)", async () => {
        for (const device of devices) {
            await page.setViewport(device.viewport);
            await page.goto("http://localhost:9000/");

            // Basic assertion: header is visible
            const header = await page.$("#head");
            expect(header).toBeTruthy();

            // Wait for tiles to load with robust check
            await page.waitForNetworkIdle({ idleTime: 2000 });
            await page.waitForFunction(() => {
                const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
                // Check if we have tiles and all are loaded
                return tiles.length > 0 && tiles.every(img => img.complete);
            }, { timeout: 10000 });

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

    test("Feature 5: Print Preview", async () => {
        await page.goto("http://localhost:9000/");

        // Emulate print media type
        await page.emulateMediaType('print');

        // Check if map is visible
        const mapVisible = await page.evaluate(() => {
            const map = document.querySelector("#map");
            return window.getComputedStyle(map).display !== 'none';
        });
        expect(mapVisible).toBe(true);

        // Reset media type
        await page.emulateMediaType('screen');
    }, timeout);

});
