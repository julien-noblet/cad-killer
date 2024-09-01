/** @format */

import "jest";
//import puppeteer, { Browser } from "puppeteer";
//import { compile } from "handlebars";
//import { run } from "jest/build";
var path = require("path");
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../../webpack.config.js');

// Extend Jest expect
const timeout = 10*60*1000; // 10 minutes

const viewports = [
  { width: 320, height: 200 },
  { width: 400, height: 200 },
  { width: 768, height: 400 },
  { width: 1024, height: 500 },
  { width: 1280, height: 500 },
  { width: 1280, height: 960 },
];


const compiler = Webpack(webpackConfig);
const devServerOptions = { ...webpackConfig.devServer, open: true };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

describe("Web Render test", () => {
  let page;
  
  /**
   * Initialize browser and server
   */
  beforeAll(async () => {
    
    runServer();

    page = await globalThis.__BROWSER_GLOBAL__.newPage();
    await page.goto('http://localhost:9000/');
  }, timeout);

  afterAll(async () => {
    // close the server
    await server.stop();
    // close the browser
    await page.close();
  });

  it("It correctly render the header", async () => {
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(`http://localhost:9000/`);
      const elem = await page.$("#head");
      const screenshot = await elem.screenshot({
        // clip: { x: 0, y: 0, width: viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        runInProcess: true ,
        customSnapshotIdentifier:
          "header_" + viewport.width + "x" + viewport.height,
        customDiffConfig: { threshold: 10 },
      });
    }
  }
  );
  it("Correctly renders main page", async () => {
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(`http://localhost:9000/`, { timeout: 300000 });
      // sleep for 5 seconds
      await page.evaluate(() => document.body.textContent);

      const screenshot = await page.screenshot({
        // no clip: { x: 0, y: 0, width: viewport.width, height: 60 }
      });
      expect(screenshot).toMatchImageSnapshot({
        runInProcess: true ,
        comparisonMethod: 'ssim',
        failureThreshold: 0.01,
        failureThresholdType: 'percent',
        maxChildProcessBufferSizeInBytes: 100*1024*1024,
        customSnapshotIdentifier:
          "main_" + viewport.width + "x" + viewport.height,
        customDiffConfig: { threshold: 10 },
      });
    }
  });

  it("List Layers", async () => {
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
      runInProcess: true ,
      customSnapshotIdentifier: "layers_list",
      customDiffConfig: { threshold: 10 },
    });
  });

  it("Attribution", async () => {
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(`http://localhost:9000/`, { timeout: 300000 });

    await page.waitForSelector(".leaflet-control-attribution", {
      visible: true,
    });
    const elem = await page.$(".leaflet-control-attribution");
    //await elem.dispose()

    const screenshot = await elem.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      runInProcess: true ,
      customSnapshotIdentifier: "attribution_default",
      customDiffConfig: { threshold: 10 },
    });
  })
/* 
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

  ;/**/ 
},timeout);
