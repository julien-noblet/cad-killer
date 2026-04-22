/**
 * @format
 */

import * as L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import { getMapInstance } from "./mapContext";

function showPosition(
  mapInstance: LeafletMap | null,
  position: GeolocationPosition,
) {
  const icon = document.getElementById("geoloc_icon");
  if (mapInstance) {
    mapInstance.setView(
      [position.coords.latitude, position.coords.longitude],
      16,
    );
    if (icon) {
      icon.className = "zmdi zmdi-2x zmdi-gps-dot";
    }
  }
}

function getLocation(mapInstance: LeafletMap | null) {
  const icon = document.getElementById("geoloc_icon");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) =>
      showPosition(mapInstance, position),
    );
    if (icon) {
      icon.className = "zmdi zmdi-2x zmdi-gps";
    }
  }
}

export function installGeoLocControl() {
  const mapInstance = getMapInstance();
  if (!mapInstance) {
    return;
  }

  const GeoLoc = L.Control.extend({
    options: {
      position: "topright",
    },
    onAdd: () => {
      const container = L.DomUtil.create("div", "leaflet-control-geoloc");
      const trigger = L.DomUtil.create("span", "geoloc", container);
      trigger.id = "geoloc";

      const icon = L.DomUtil.create("i", "zmdi zmdi-2x zmdi-gps-off", trigger);
      icon.id = "geoloc_icon";

      trigger.addEventListener("click", () => getLocation(mapInstance));
      return container;
    },
  });

  mapInstance.addControl(new GeoLoc());
}
