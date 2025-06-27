/**
 * setup.js - Initialisation du navigateur Puppeteer pour les tests end-to-end
 */
import { mkdir, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer';

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

export default async function setup() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  globalThis.__BROWSER_GLOBAL__ = browser;
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};