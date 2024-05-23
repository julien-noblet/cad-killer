/**
 * global L, map
 *
 * @format
 */

import * as L from "leaflet";
import { mymap as map } from "./map";

// Géoloc
function showPosition(position: { coords: { latitude: any; longitude: any; }; }) {
  const icone = L.DomUtil.get(document.getElementById("geoloc_icon"));
  if (map !== null) {
    map.setView(
      [position.coords.latitude, position.coords.longitude],
      16
    );
    icone.className = "zmdi zmdi-2x zmdi-gps-dot";
  }
}

/* eslint-disable no-unused-vars */
function getLocation() {
  const icone = document.getElementById("geoloc_icon");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    icone.className = "zmdi zmdi-2x zmdi-gps";
  }
}
/* eslint-enable no-unused-vars */

const GeoLoc = L.Control.extend({
  options: {
    position: "topright",
  },
  onAdd: () => {
    const container = L.DomUtil.create("div", "leaflet-control-geoloc");
    container.innerHTML =
      '<span onClick="getLocation();" id="geoloc" class="geoloc"><i class="zmdi zmdi-2x zmdi-gps-off" id="geoloc_icon"></i></span>';
    // ... initialize other DOM elements, add listeners, etc.
    return container;
  },
});

map.addControl(new GeoLoc());
