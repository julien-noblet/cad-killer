const timeout = 60 * 1000;

describe("Security vulnerability reproduction", () => {
  let page;

  beforeAll(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  }, timeout);

  afterAll(async () => {
    if (page) await page.close();
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

      page.on("request", (request) => {
        if (request.url().includes("api-adresse.data.gouv.fr/search")) {
          // console.log('Intercepting search request');
          request.respond({
            content: "application/json",
            body: JSON.stringify(maliciousPayload),
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        } else if (request.url().includes("api-adresse.data.gouv.fr/reverse")) {
          // console.log('Intercepting reverse request');
          request.respond({
            content: "application/json",
            body: JSON.stringify(maliciousPayload),
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        } else {
          request.continue();
        }
      });

      await page.goto("http://localhost:9000/");
      await page.waitForSelector("#map");

      // --- Test Photon Search XSS ---
      const inputSelector = ".photon-input";
      await page.waitForSelector(inputSelector);
      await page.type(inputSelector, "test");

      await new Promise((r) => setTimeout(r, 2000));

      let xssTriggered = await page.evaluate(() => window.xssTriggered);
      expect(xssTriggered).toBeUndefined();

      // Check content safely.
      const pageText = await page.evaluate(() => document.body.textContent);
      expect(pageText).toContain(
        "<img src=x onerror=window.xssTriggered=true>",
      );

      // --- Test Reverse Label XSS ---
      // Reset trigger
      await page.evaluate(() => (window.xssTriggered = undefined));

      // Set zoom > 14 and move map
      await page.evaluate(() => {
        window.map.setZoom(15);
        window.map.panBy([10, 10]);
      });

      // Wait for moveend and reverse geocode
      await new Promise((r) => setTimeout(r, 2000));

      xssTriggered = await page.evaluate(() => window.xssTriggered);
      expect(xssTriggered).toBeUndefined();
    },
    timeout,
  );
});
