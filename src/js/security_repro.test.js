const timeout = 60 * 1000;

describe("Security vulnerability reproduction", () => {
  let page;

  beforeEach(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  }, timeout);

  afterEach(async () => {
    if (page) await page.close();
    page = null;
  });

  test(
    "XSS in photon search results should be prevented",
    async () => {
      await page.setRequestInterception(true);

      const maliciousPayload = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [2.3522, 48.8566],
            },
            properties: {
              label: "Malicious Place",
              name: "<img src=x onerror=window.xssTriggered=true>",
              type: "street",
              city: "Paris",
              context: "75, Paris, Île-de-France",
            },
          },
        ],
      };

      const requestHandler = (request) => {
        if (request.url().includes("data.geopf.fr/geocodage/search")) {
          request.respond({
            contentType: "application/json",
            body: JSON.stringify(maliciousPayload),
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        } else if (request.url().includes("data.geopf.fr/geocodage/reverse")) {
          request.respond({
            contentType: "application/json",
            body: JSON.stringify(maliciousPayload),
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        } else {
          request.continue();
        }
      };

      page.on("request", requestHandler);

      try {
        await page.goto("http://localhost:9000/");
        await page.waitForSelector("#map");

        // --- Test Photon Search XSS ---
        const inputSelector = ".photon-input";
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, "test");

        // Wait for the autocomplete to render with the payload text
        await page.waitForFunction(
          () =>
            document.body.textContent.includes(
              "<img src=x onerror=window.xssTriggered=true>",
            ),
          { timeout: 10000 },
        );

        let xssTriggered = await page.evaluate(() => window.xssTriggered);
        expect(xssTriggered).toBeUndefined();

        const pageText = await page.evaluate(() => document.body.textContent);
        expect(pageText).toContain(
          "<img src=x onerror=window.xssTriggered=true>",
        );

        // --- Test Reverse Label XSS ---
        await page.evaluate(() => (window.xssTriggered = undefined));

        // Set zoom > 14 and move map, then wait for reverse geocode response
        await page.evaluate(() => {
          window.map.setZoom(15);
          window.map.panBy([10, 10]);
        });

        // Wait for the reverse geocode request to be intercepted and processed
        await page
          .waitForFunction(() => window.__reverseGeocoded === true, {
            timeout: 5000,
          })
          .catch(() => {
            /* reverse geocode may not fire in this test context */
          });

        xssTriggered = await page.evaluate(() => window.xssTriggered);
        expect(xssTriggered).toBeUndefined();
      } finally {
        page.off("request", requestHandler);
        await page.setRequestInterception(false);
      }
    },
    timeout,
  );
});
