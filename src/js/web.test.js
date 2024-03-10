/** @format */

import "jest";
var path = require("path");
import puppeteer, { Browser } from "puppeteer";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { compile } from "handlebars";
const { toMatchImageSnapshot } = require("jest-image-snapshot");

// Extend Jest expect
expect.extend({ toMatchImageSnapshot });

const viewports = [
  { width: 320, height: 200 },
  { width: 400, height: 200 },
  { width: 768, height: 400 },
  { width: 1024, height: 500 },
  { width: 1280, height: 500 },
  { width: 1280, height: 960 },
];

describe("Web Render test", () => {
  let server;

  /**
   * Initialize browser and server
   */
  beforeAll(async () => {
    jest.setTimeout(10 * 60 * 1000); // 5 min allow test to run for longer time so they don't timeout
    //await browser.ignoreHTTPSErrors = true //force
  });

  test("Correctly renders header", async () => {
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(`http://localhost:9000/`, { timeout: 300000 });
      const elem = await page.$("#head");
      const screenshot = await elem.screenshot({
        // clip: { x: 0, y: 0, width: viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier:
          "header_" + viewport.width + "x" + viewport.height,
        customDiffConfig: { threshold: 10 },
      });
    }
  });
  test.skip("Correctly renders header for mobiles", async () => {
    for (const device of puppeteer.devices) {
      await page.emulate(device);
      await page.goto(`http://localhost:9000/`);
      const elem = await page.$("#head");
      const screenshot = await elem.screenshot({
        //        clip: { x: 0, y: 0, width: device.viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: "header_" + device.name,
      });
    }
  });
  test("Correctly renders main page", async () => {
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(`http://localhost:9000/`, { timeout: 300000 });
      const screenshot = await page.screenshot({
        // no clip: { x: 0, y: 0, width: viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier:
          "main_" + viewport.width + "x" + viewport.height,
        customDiffConfig: { threshold: 10 },
      });
    }
  });
  test.skip("Correctly renders mobile main page", async () => {
    for (const device of puppeteer.devices) {
      const page = await browser.newPage();
      await page.emulate(device);
      await page.goto(`http://localhost:9000/`, { timeout: 300000 });
      const screenshot = await page.screenshot({
        //no clip: { x: 0, y: 0, width: device.viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: "main_" + device.name,
        customDiffConfig: { threshold: 10 },
      });
    }
  });

  test("List Layers", async () => {
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(`http://localhost:9000/`, { timeout: 300000 });
    await page.waitForSelector(".leaflet-control-layers-toggle", {
      visible: true,
    });
    //await page.hover(".leaflet-control-layers-toggle");
    await page.evaluate(() => {
      document
        .getElementsByClassName("leaflet-control-layers")[0]
        .classList.add("leaflet-control-layers-expanded");
    });
    await page.hover(".leaflet-control-layers-list");
    await page.waitForSelector(".leaflet-control-layers-list", {
      visible: true,
    });
    const elem = await page.$(".leaflet-control-layers-list");
    //await elem.dispose()

    const screenshot = await elem.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: "layers_list",
      customDiffConfig: { threshold: 10 },
    });
  });

  test("Attribution", async () => {
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(`http://localhost:9000/`, { timeout: 300000 });

    await page.waitForSelector(".leaflet-control-attribution", {
      visible: true,
    });
    const elem = await page.$(".leaflet-control-attribution");
    //await elem.dispose()

    const screenshot = await elem.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: "attribution_default",
      customDiffConfig: { threshold: 10 },
    });
  });
});
