/**
 * @format
 */

import * as L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import { photon } from "./photon";
import { installReverseLabel } from "./reverseLabel";

import "leaflet-hash";

const container =
  typeof document !== "undefined" ? document.getElementById("map") : null;
// eslint-disable-next-line no-underscore-dangle
if (container && !(container as any)._leaflet_id) {
  const mapInstance = L.map(container, { attributionControl: false });
  if (typeof window === "object" && window !== null) {
    window.map = mapInstance;
  }

  L.Icon.Default.imagePath = "/cad-killer/images/";
  mapInstance.addLayer(layerOSMfr);
  L.control.layers(baseMaps, overlayMaps).addTo(mapInstance);
  mapInstance.setView(CENTER, 6);
  mapInstance.dragging.enable();
  L.control
    .attribution({ position: "bottomleft", prefix: ATTRIBUTIONS })
    .addTo(mapInstance);

  const HashControl =
    (typeof window !== "undefined" && window.L?.Hash) || L.Hash;
  if (typeof HashControl === "function") {
    new HashControl(mapInstance);
  }

  photon(mapInstance);
  installReverseLabel(mapInstance);
}
