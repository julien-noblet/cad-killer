import teardown from './teardown';

describe('teardown.js', () => {
  afterEach(() => {
    globalThis.__BROWSER_GLOBAL__ = undefined;
  });

  it('doit exporter une fonction async', () => {
    expect(typeof teardown).toBe('function');
    expect(teardown.constructor.name).toBe('AsyncFunction');
  });
  it('peut être appelée sans erreur (mock browser global)', async () => {
    globalThis.__BROWSER_GLOBAL__ = { close: jest.fn().mockResolvedValue() };
    await expect(teardown()).resolves.toBeUndefined();
  });
  it('supprime le dossier temporaire même sans navigateur', async () => {
    await expect(teardown()).resolves.toBeUndefined();
  });
});