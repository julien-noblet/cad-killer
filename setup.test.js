import setup from './setup';

describe('setup.js', () => {
  it('doit exporter une fonction async', () => {
    expect(typeof setup).toBe('function');
    expect(setup.constructor.name).toBe('AsyncFunction');
  });

  it('peut être appelée sans erreur (mock puppeteer)', async () => {
    const oldLaunch = require('puppeteer').launch;
    require('puppeteer').launch = async () => ({ wsEndpoint: () => 'ws://mock', close: jest.fn() });
    globalThis.__BROWSER_GLOBAL__ = undefined;
    await expect(setup()).resolves.toBeUndefined();
    require('puppeteer').launch = oldLaunch;
  });
});