/** @format */

import {
  baseMaps,
  overlayMaps,
  layerOSMfr,
  layerOSM,
  layerCadastre,
  overlayCadastre,
  layerEsriWorldImagery,
  layerEsriWorldStreetMap,
} from "./layers";

describe("layers.ts check layer registry and configurations", () => {
  test("baseMaps contains all expected base tile layers", () => {
    expect(Object.keys(baseMaps)).toEqual([
      "OpenStreetMap France",
      "OpenStreetMap",
      "Cadastre",
      "Esri",
      "World Street Map",
    ]);
    expect(baseMaps["OpenStreetMap France"]).toBe(layerOSMfr);
    expect(baseMaps["OpenStreetMap"]).toBe(layerOSM);
    expect(baseMaps["Cadastre"]).toBe(layerCadastre);
    expect(baseMaps["Esri"]).toBe(layerEsriWorldImagery);
    expect(baseMaps["World Street Map"]).toBe(layerEsriWorldStreetMap);
  });

  test("overlayMaps contains expected overlays", () => {
    expect(Object.keys(overlayMaps)).toEqual(["Cadastre"]);
    expect(overlayMaps["Cadastre"]).toBe(overlayCadastre);
  });

  test("layerOSMfr has maxZoom 20 and OSM France attribution", () => {
    expect(layerOSMfr.options.maxZoom).toBe(20);
    expect(layerOSMfr.options.attribution).toContain("OpenStreetMap France");
  });

  test("layerOSM has maxZoom 19 and OSM attribution", () => {
    expect(layerOSM.options.maxZoom).toBe(19);
    expect(layerOSM.options.attribution).toContain("OpenStreetMap");
  });

  test("layerCadastre and overlayCadastre have zoom limits [16, 22]", () => {
    expect(layerCadastre.options.minZoom).toBe(16);
    expect(layerCadastre.options.maxZoom).toBe(22);
    expect(overlayCadastre.options.minZoom).toBe(16);
    expect(overlayCadastre.options.maxZoom).toBe(22);
  });

  test("layerEsriWorldImagery and layerEsriWorldStreetMap have Esri attributions", () => {
    expect(layerEsriWorldImagery.options.attribution).toContain("Esri");
    expect(layerEsriWorldStreetMap.options.attribution).toContain("Esri");
  });
});
