/**
 * @jest-environment jsdom
 */
import * as geoloc from './geoloc';
describe('geoloc module', () => {
  it('doit exporter getLocation', () => {
    expect(typeof geoloc.getLocation).toBe('function');
  });
  it('doit exporter GeoLocControl', () => {
    expect(typeof geoloc.GeoLocControl).toBe('function');
  });
  it('doit exporter addGeoLocControlToMap', () => {
    expect(typeof geoloc.addGeoLocControlToMap).toBe('function');
  });
});
