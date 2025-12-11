const timeout = 60 * 1000 * 5;

describe("E2E Tests - General", () => {
  let page;

  beforeAll(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
    // custom console
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  }, timeout);

  afterAll(async () => {
    if (page) await page.close();
  });

  test.skip(
    "Feature 1: Search for '14 rue Michel Labrousse, Toulouse'",
    async () => {
      // Mock the search API
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        // custom console
        console.log("DEBUG REQUEST:", request.url()); // Log all requests
        if (request.url().includes("data.geopf.fr")) {
          // custom console
          console.log("Intercepted Target Request:", request.url());
          request.respond({
            content: "application/json",
            body: JSON.stringify({
              type: "FeatureCollection",
              features: [
                {
                  geometry: { type: "Point", coordinates: [1.397, 43.582] },
                  properties: {
                    label: "14 Rue Michel Labrousse 31100 Toulouse",
                    name: "14 Rue Michel Labrousse",
                    city: "Toulouse",
                    context: "31, Haute-Garonne, Occitanie",
                    type: "street",
                  },
                },
              ],
            }),
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
        const input = document.querySelector(".photon-input");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("keyup", { bubbles: true }));
      });

      // Wait for results
      try {
        await page.waitForSelector(".photon-autocomplete", { timeout: 10000 });
      } catch (e) {
        // custom console
        console.log(
          "Timeout waiting for .photon-autocomplete. HTML:",
          await page.content(),
        );
        throw e;
      }
      const firstResult = await page.waitForSelector(".photon-autocomplete li");
      const text = await page.evaluate((el) => el.innerText, firstResult);
      expect(text).toContain("14 Rue Michel Labrousse");

      // Cleanup interception
      await page.setRequestInterception(false);
      page.removeAllListeners("request");
    },
    timeout,
  );

  test(
    "Feature 2: Layer Control",
    async () => {
      await page.goto("http://localhost:9000/");
      const layerControl = await page.waitForSelector(
        ".leaflet-control-layers-toggle",
      );

      // Hover to expand
      await layerControl.hover();
      await page.waitForSelector(".leaflet-control-layers-list", {
        visible: true,
      });

      const labels = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".leaflet-control-layers-base label span"),
        ).map((el) => el.innerText.trim());
      });

      const expectedLayers = ["OpenStreetMap France", "OpenStreetMap"];

      expectedLayers.forEach((layer) => {
        expect(labels).toContainEqual(expect.stringContaining(layer));
      });
    },
    timeout,
  );

  test(
    "Feature 3: Attribution",
    async () => {
      await page.goto("http://localhost:9000/");
      const attribution = await page.waitForSelector(
        ".leaflet-control-attribution",
      );
      const html = await page.evaluate((el) => el.innerHTML, attribution);

      expect(html).toContain("Contributeurs de OpenStreetMap");
      expect(html).toContain("Adresses BAN");
    },
    timeout,
  );

  test(
    "Feature 5: Print Preview",
    async () => {
      await page.goto("http://localhost:9000/");

      // Emulate print media type
      await page.emulateMediaType("print");

      // Check if map is visible
      const mapVisible = await page.evaluate(() => {
        const map = document.querySelector("#map");
        return window.getComputedStyle(map).display !== "none";
      });
      expect(mapVisible).toBe(true);

      // Reset media type
      await page.emulateMediaType("screen");
    },
    timeout,
  );
});
