/** @format */

import type { Map as LeafletMap } from "leaflet";

let activeMap: LeafletMap | null = null;

export function setMapInstance(mapInstance: LeafletMap | null): void {
  activeMap = mapInstance;
  if (typeof window === "object" && window !== null) {
    window.map = mapInstance;
  }
}

export function getMapInstance(): LeafletMap | null {
  if (activeMap) {
    return activeMap;
  }
  if (typeof window === "object" && window !== null && window.map) {
    return window.map;
  }
  return null;
}
