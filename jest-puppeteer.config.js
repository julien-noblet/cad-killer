/** @format */

module.exports = {
  server: {
    command: "npx webpack serve --open",
    port: 9000,
    launchTimeout: 120000,
  },
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
