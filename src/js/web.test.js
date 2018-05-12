/** @format */

// example.test.ts
import "jest";
var path = require("path");
import puppeteer, { Browser } from "puppeteer";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { compile } from "handlebars";
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const devices = require("puppeteer/DeviceDescriptors");

// Extend Jest expect
expect.extend({ toMatchImageSnapshot });

const viewports = [
  { width: 320, height: 200 },
  { width: 400, height: 200 },
  { width: 768, height: 400 },
  { width: 1024, height: 500 },
  { width: 1280, height: 500 },
  { width: 1280, height: 960 }
];

describe("Web Render test", () => {
  let server: WebpackDevServer;
  let browser: Browser;

  /**
   * Initialize browser and server
   */
  beforeAll(async () => {
    jest.setTimeout(1200000); // allow test to run for longer time so they don't timeout
    var config = require(path.join(__dirname, "/../../webpack.config.js"));
    var compiler = webpack(config);
    var settings = {
      /* webpack config here*/
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      https: true,
      port: 9000
    };
    server = new WebpackDevServer(compiler, settings);
    server.listen(settings.port, "127.0.0.1");
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true
    });
    //await browser.ignoreHTTPSErrors = true //force
  });

  /**
   * Close browser and server
   */
  afterAll(async () => {
    server.close();
    browser.close();
  });

  test("Correctly renders header", async () => {
    for (const viewport of viewports) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto(`https://localhost:9000/`);
      const screenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier:
          "header_" + viewport.width + "x" + viewport.height
      });
    }
  });
  test.skip("Correctly renders header for mobiles", async () => {
    for (const device of devices) {
      const page = await browser.newPage();
      await page.emulate(device);
      await page.goto(`https://localhost:9000/`);
      const screenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: device.viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: "header_" + device.name
      });
    }
  });
  test("Correctly renders main page", async () => {
    for (const viewport of viewports) {
      const page = await browser.newPage();

      await page.goto(`https://localhost:9000/`);
      await page.setViewport(viewport);
      const screenshot = await page.screenshot({
        // no clip: { x: 0, y: 0, width: viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier:
          "main_" + viewport.width + "x" + viewport.height,
        customDiffConfig: { threshold: 10 }
      });
    }
  });
  test.skip("Correctly renders mobile main page", async () => {
    for (const device of devices) {
      const page = await browser.newPage();
      await page.emulate(device);
      await page.goto(`https://localhost:9000/`);
      const screenshot = await page.screenshot({
        //no clip: { x: 0, y: 0, width: device.viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: "main_" + device.name,
        customDiffConfig: { threshold: 10 }
      });
    }
  });

  test("List Layers", async () => {
    const page = await browser.newPage();
    await page.goto(`https://localhost:9000/`);
    await page.waitForSelector(".leaflet-control-layers-toggle", {
      visible: true
    });
    await page.hover(".leaflet-control-layers-toggle");
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: "layers_list",
      customDiffConfig: { threshold: 10 }
    });
  });
});
