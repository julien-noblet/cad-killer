/**
 * @format
 */

import * as L from "leaflet";
import { REVERSE_URL } from "./config";
import { getMapInstance } from "./mapContext";

const LeafletAny = L as any;

export function installReverseLabel() {
  const mapInstance = getMapInstance();
  if (!mapInstance) {
    return;
  }

  const ReverseLabelControl = LeafletAny.Control.extend({
    options: {
      position: "topright",
    },

    onAdd: () => {
      const container = L.DomUtil.create("div", "reverse-label");
      const reverse = new LeafletAny.PhotonReverse({
        url: REVERSE_URL,
        handleResults: (data: any) => {
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
          if (head !== null && !head.className.includes("headmasked")) {
            head.className += " headmasked";
          }
          if (map !== null && !map.className.includes("nohead")) {
            map.className += " nohead";
          }
        } else {
          container.innerHTML = "";
        }
      });
      return container;
    },
  });

  new ReverseLabelControl().addTo(mapInstance);
}
