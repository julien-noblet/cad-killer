/** @format */

// Browser launch options used by jest-puppeteer.
// Server lifecycle is managed by setup.js / teardown.js.
module.exports = {
  launch: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    dumpio: true,
    headless: process.env.HEADLESS !== "false",
  },
};
