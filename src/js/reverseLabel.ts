/**
 * @format
 */

import * as L from "leaflet";
import type { PhotonFeature } from "../../types/leaflet-plugins";
import "leaflet.photon";
import { REVERSE_URL } from "./config";

export function installReverseLabel(mapInstance: L.Map) {
  if (!mapInstance) {
    return;
  }

  const ReverseLabelControl = L.Control.extend({
    options: {
      position: "topright",
    },

    onAdd: () => {
      const container = L.DomUtil.create("div", "reverse-label");
      const PhotonReverse =
        (typeof window !== "undefined" && window.L?.PhotonReverse) ||
        L.PhotonReverse;
      const reverse = new PhotonReverse({
        url: REVERSE_URL,
        handleResults: (data: { features?: PhotonFeature[] }) => {
          if (data.features?.[0]?.properties?.label) {
            container.textContent = `Carte centrée sur «${data.features[0].properties.label}»`;
          }
        },
      });

      mapInstance.on("moveend", () => {
        if (mapInstance.getZoom() > 14) {
          reverse.doReverse(mapInstance.getCenter());
          const head = document.getElementById("head");
          const map = document.getElementById("map");
          head?.classList.add("headmasked");
          map?.classList.add("nohead");
        } else {
          container.innerHTML = "";
        }
      });
      return container;
    },
  });

  new ReverseLabelControl().addTo(mapInstance);
}
