/**
 * @jest-environment jsdom
 */
import * as map from './map';
describe('map module', () => {
  it('doit exporter getMapElement', () => {
    expect(typeof map.getMapElement).toBe('function');
  });
  it('doit exporter initializeMap', () => {
    expect(typeof map.initializeMap).toBe('function');
  });
  it('doit exporter bootstrapMap', () => {
    expect(typeof map.bootstrapMap).toBe('function');
  });
});
describe("map.js", () => {
  it("bootstrapMap initialise window.map", async () => {
    delete window.map;
    document.body.innerHTML = '<div id="map"></div>';
    await import("./map");
    expect(window.map).toBeDefined();
  });
});
