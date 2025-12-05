/**
 * @format
 */

import L from "leaflet";
import { REVERSE_URL } from "./config";

L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: "topright", // hack
  },

  onAdd: () => {
    const container = L.DomUtil.create("div", "reverse-label");
    const reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: (data) => {
        if (data.features !== null) {
          if (data.features[0] !== null) {
            if (data.features[0].properties !== null) {
              container.textContent = `Carte centrée sur «${data.features[0].properties.label}»`;
            }
          }
        }
      },
    });

    window.map.on("moveend", () => {
      if (window.map.getZoom() > 14) {
        reverse.doReverse(window.map.getCenter());
        let head = document.getElementById("head");
        let map = document.getElementById("map");
        if (head !== null) {
          head.className += " headmasked";
        }
        if (map !== null) {
          map.className += " nohead";
        }
      } else {
        container.innerHTML = "";
      }
    });
    return container;
  },
});

new L.Control.ReverseLabel().addTo(window.map);
