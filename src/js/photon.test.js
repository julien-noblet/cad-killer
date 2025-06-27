import * as photon from './photon';
describe('photon module', () => {
  it('doit exporter photon', () => {
    expect(typeof photon.photon).toBe('function');
  });
});
