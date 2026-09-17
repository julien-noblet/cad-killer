/**
 * @format
 */

import * as L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import { photon } from "./photon";
import { installReverseLabel } from "./reverseLabel";
import { initPrintListeners } from "./print";

import "leaflet-hash";

const container =
  typeof document !== "undefined" ? document.getElementById("map") : null;
/* eslint-disable no-underscore-dangle */
if (container && !(container as any)._leaflet_id) {
  const mapInstance = L.map(container, { attributionControl: false });
  if (typeof window === "object" && window !== null) {
    window.map = mapInstance;
  }
  (container as any)._leaflet_map = mapInstance;
  /* eslint-enable no-underscore-dangle */

  L.Icon.Default.imagePath = "/cad-killer/images/";
  mapInstance.addLayer(layerOSMfr);
  L.control.layers(baseMaps, overlayMaps).addTo(mapInstance);
  const layerToggle = container?.querySelector<HTMLAnchorElement>(
    ".leaflet-control-layers-toggle",
  );
  if (layerToggle) {
    layerToggle.title = "Fonds de carte";
    layerToggle.setAttribute("aria-label", "Fonds de carte");
  }
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
  initPrintListeners();
}
