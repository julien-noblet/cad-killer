/**
 * @format
 * Contrôle Leaflet pour afficher le label d'adresse lors du centrage carte.
 */

import L from "leaflet";
import { REVERSE_URL } from "./config";

/**
 * Contrôle Leaflet pour afficher le label d'adresse lors du centrage carte.
 * @class
 */
L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: "topright",
  },

  onAdd() {
    const container = L.DomUtil.create("div", "reverse-label");
    const reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: (data) => {
        const label = data?.features?.[0]?.properties?.label;
        container.innerHTML = label ? `Carte centrée sur «${label}»` : "";
      },
    });

    const updateLabel = () => {
      const map = window.map;
      if (map.getZoom() > 14) {
        reverse.doReverse(map.getCenter());
        const head = document.getElementById("head");
        const mapEl = document.getElementById("map");
        if (head && !head.className.includes("headmasked")) {
          head.className += " headmasked";
        }
        if (mapEl && !mapEl.className.includes("nohead")) {
          mapEl.className += " nohead";
        }
      } else {
        container.innerHTML = "";
      }
    };

    window.map.on("moveend", updateLabel);
    return container;
  },
});

// Ajout automatique du contrôle si la carte existe
if (window.map) {
  new L.Control.ReverseLabel().addTo(window.map);
}
