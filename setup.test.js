import setup from './setup';

describe('setup.js', () => {
  it('doit exporter une fonction async', () => {
    expect(typeof setup).toBe('function');
    expect(setup.constructor.name).toBe('AsyncFunction');
  });

  it('peut être appelée sans erreur (mock puppeteer)', async () => {
    const puppeteer = require('puppeteer');
    const oldLaunch = puppeteer.launch;
    puppeteer.launch = async () => ({ wsEndpoint: () => 'ws://mock', close: jest.fn() });
    globalThis.__BROWSER_GLOBAL__ = undefined;
    await expect(setup()).resolves.toBeUndefined();
    puppeteer.launch = oldLaunch;
  });
});