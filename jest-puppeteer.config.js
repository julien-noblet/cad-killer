/** @format */

module.exports = {
  server: {
    command: "yarn webpack-dev-server --port 9000 --mode development",
    port: 9000,
    launchTimeout: 120000
  },
  launch: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    dumpio: true,
    headless: process.env.HEADLESS !== "false"
  }
};
