import * as layers from './layers';
describe('layers module', () => {
  it('doit exporter layerOSMfr', () => {
    expect(layers.layerOSMfr).toBeDefined();
  });
  it('doit exporter baseMaps et overlayMaps', () => {
    expect(typeof layers.baseMaps).toBe('object');
    expect(typeof layers.overlayMaps).toBe('object');
  });
});
