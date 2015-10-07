/* global L,
          REVERSE_URL,
          map
*/
"use strict";

L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: "topright" // hack
  },

  onAdd: function() {
    var container = L.DomUtil.create("div", "reverse-label"),
      reverse = new L.PhotonReverse({
        url: REVERSE_URL,
        handleResults: function(data) {
          container.innerHTML = "Carte centrée sur «" + data.features[0].properties.label + "»";
        }
      });

    map.on("moveend", function() {
      if (this.getZoom() > 14) {
        reverse.doReverse(this.getCenter());
        document.getElementById("head").className += " headmasked";
        document.getElementById("map").className += " nohead";
      } else {
        container.innerHTML = "";
      }
    });
    return container;
  }
});

new L.Control.ReverseLabel().addTo(map);
