const { mkdir, writeFile } = require("fs").promises;
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");
const { spawn } = require("child_process");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

module.exports = async function () {
  console.log("Setup: Launching browser...");
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  // store the browser instance so we can teardown it later
  globalThis.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, "wsEndpoint"), browser.wsEndpoint());

  console.log("Setup: Starting webpack server...");
  // Start webpack dev server
  const server = spawn("npx", ["webpack", "serve"], {
    shell: false,
    detached: true,
    stdio: "ignore",
  });

  globalThis.__SERVER_GLOBAL__ = server;

  // Wait for port 9000 to be open
  const waitPort = require("net");
  const checkPort = () =>
    new Promise((resolve, reject) => {
      const socket = new waitPort.Socket();
      const timeout = 200;
      let retries = 300; // 60 seconds

      const tryConnect = () => {
        socket.connect(9000, "localhost");
      };

      socket.on("connect", () => {
        socket.end();
        resolve();
      });

      socket.on("error", () => {
        if (retries-- > 0) {
          setTimeout(tryConnect, timeout);
        } else {
          reject(new Error("Server failed to start on port 9000"));
        }
      });

      tryConnect();
    });

  try {
    await checkPort();
    console.log("Setup: Server started on port 9000");
  } catch (e) {
    console.error(e);
    if (server) process.kill(-server.pid);
    if (browser) await browser.close();
    throw e;
  }
};
