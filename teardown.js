const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const DIR = process.env.JEST_PUPPETEER_DIR;
module.exports = async function () {
  // custom console
  console.log("Teardown: Closing browser...");
  if (globalThis.__BROWSER_GLOBAL__) {
    await globalThis.__BROWSER_GLOBAL__.close();
  }

  // custom console
  console.log("Teardown: Stopping server...");
  if (globalThis.__SERVER_GLOBAL__) {
    // Kill the process group to ensure the spawned process and its children are killed
    try {
      process.kill(-globalThis.__SERVER_GLOBAL__.pid);
    } catch {
      // Ignore if already dead
    }
  }

  // clean-up the wsEndpoint file
  await fs.rm(DIR, { recursive: true, force: true });
};
