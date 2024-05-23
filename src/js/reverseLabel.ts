/**
 * @flow
 *
 * @format
 */

import * as L from "leaflet";
import { REVERSE_URL } from "./config";
import { mymap as map } from "./map";
import 'leaflet.photon';

const ReverseLabel = L.Control.extend({
  options: {
    position: "topright", // hack
  },

  onAdd: () => {
    const container = L.DomUtil.create("div", "reverse-label");
    const reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: (data: { features: { properties: { label: any; }; }[]; }) => {
        if (data.features !== null) {
          if (data.features[0] !== null) {
            if (data.features[0].properties !== null) {
              container.innerHTML = `Carte centrée sur «${data.features[0].properties.label}»`;
            }
          }
        }
      },
    });

    map.on("moveend", () => {
      if (map.getZoom() > 14) {
        reverse.doReverse(map.getCenter());
        let head = document.getElementById("head");
        let newmap = document.getElementById("map");
        if (head !== null) {
          head.className += " headmasked";
        }
        if (newmap !== null) {
          newmap.className += " nohead";
        }
      } else {
        container.innerHTML = "";
      }
    });
    return container;
  },
});

new ReverseLabel().addTo(map);
