const fs = require('fs').promises;
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  try {
    // Ferme l'instance du navigateur Puppeteer si elle existe
    if (globalThis.__BROWSER_GLOBAL__) {
      await globalThis.__BROWSER_GLOBAL__.close();
    }
    // Nettoie le répertoire temporaire utilisé pour le wsEndpoint
    await fs.rm(DIR, { recursive: true, force: true });
  } catch (error) {
    // Log l'erreur mais ne fait pas échouer le teardown
    console.error('Erreur lors du teardown Puppeteer :', error);
  }
};