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

  let isPrinting = false;
  let prePrintCenter: L.LatLng | null = null;
  let prePrintZoom: number | null = null;
  let prePrintBounds: L.LatLngBounds | null = null;

  const onBeforePrint = () => {
    if (isPrinting) return;
    isPrinting = true;
    prePrintCenter = mapInstance.getCenter();
    prePrintZoom = mapInstance.getZoom();
    prePrintBounds = mapInstance.getBounds();
    mapInstance.invalidateSize({ pan: false, debounceMoveend: false });
    if (prePrintBounds) {
      mapInstance.fitBounds(prePrintBounds, { animate: false });
    }
  };

  const onAfterPrint = () => {
    if (!isPrinting) return;
    isPrinting = false;
    mapInstance.invalidateSize({ pan: false, debounceMoveend: false });
    if (prePrintCenter && prePrintZoom !== null) {
      mapInstance.setView(prePrintCenter, prePrintZoom, { animate: false });
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    if (typeof window.matchMedia === "function") {
      const mediaQueryList = window.matchMedia("print");
      if (typeof mediaQueryList.addEventListener === "function") {
        mediaQueryList.addEventListener("change", (mql) => {
          if (mql.matches) {
            onBeforePrint();
          } else {
            onAfterPrint();
          }
        });
      }
    }
  }
}
