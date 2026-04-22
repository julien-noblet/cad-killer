/** @format */

import * as L from "leaflet";
import type { Layer, Map as LeafletMap, LatLngExpression } from "leaflet";

type LeafletWithHash = typeof L & {
  Hash?: new (map: LeafletMap) => unknown;
};

export function createMainMap(containerId: string): LeafletMap {
  return L.map(containerId, {
    attributionControl: false,
  });
}

export function addBaseLayer(mapInstance: LeafletMap, layer: Layer): void {
  mapInstance.addLayer(layer);
}

export function setInitialView(
  mapInstance: LeafletMap,
  center: LatLngExpression,
  zoom: number,
): void {
  mapInstance.setView(center, zoom);
  mapInstance.dragging.enable();
}

export function addAttributions(mapInstance: LeafletMap, prefix: string): void {
  L.control
    .attribution({
      position: "bottomleft",
      prefix,
    })
    .addTo(mapInstance);
}

export function addHashToUrl(mapInstance: LeafletMap): void {
  const leafletWithHash = L as LeafletWithHash;
  if (typeof leafletWithHash.Hash === "function") {
    new leafletWithHash.Hash(mapInstance);
  }
}
