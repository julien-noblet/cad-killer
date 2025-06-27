/**
 * teardown.js - Fermeture du navigateur Puppeteer et nettoyage après les tests end-to-end
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

export default async function teardown() {
  try {
    if (globalThis.__BROWSER_GLOBAL__) {
      await globalThis.__BROWSER_GLOBAL__.close();
    }
    await fs.rm(DIR, { recursive: true, force: true });
  } catch (error) {
    console.error('Erreur lors du teardown Puppeteer :', error);
  }
}