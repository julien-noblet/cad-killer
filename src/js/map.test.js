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
