import PuppeteerEnvironment from './puppeteer_environment';

describe('puppeteer_environment.js', () => {
  it('doit exporter une classe', () => {
    expect(typeof PuppeteerEnvironment).toBe('function');
    expect(PuppeteerEnvironment.prototype).toBeDefined();
    expect(Object.getPrototypeOf(PuppeteerEnvironment)).toBe(Function.prototype);
  });
  it('peut être instanciée', () => {
    const env = new PuppeteerEnvironment({});
    expect(env).toBeInstanceOf(PuppeteerEnvironment);
  });
});