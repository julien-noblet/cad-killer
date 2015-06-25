/*global L,
  ATTRIBUTIONS,
  CENTER,
  overlayMaps,
  baseMaps,
  REVERSE_URL,
  layerOSMfr,
  photonControlOptions,
  photonReverseControlOptions,
  searchPoints
   */

var map = L.map("map", {
  photonControl: true,
  photonControlOptions: photonControlOptions,
  photonReverseControl: true,
  photonReverseControlOptions: photonReverseControlOptions,
  attributionControl: false
});

var layers = L.control.layers(baseMaps, overlayMaps);

// ajout hash dans l'URL
/*eslint-disable no-unused-vars */
var hash = new L.Hash(map);
/*eslint-enable no-unused-vars */

L.Icon.Default.imagePath = "./images";
map.addLayer(layerOSMfr);

layers.addTo(map);

map.setView(CENTER, 6);
searchPoints.addTo(map);

L.control.attribution({
  position: "bottomleft",
  prefix: ATTRIBUTIONS
}).addTo(map);
L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: "topright" //"bottomright"
  },

  onAdd: function() {
    "use strict";
    var container = L.DomUtil.create("div", "reverse-label");
    var reverse = new L.PhotonReverse({
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


// edition
/*
var edit = function () {
  var center = map.getCenter();
  var url = "http://www.openstreetmap.org/edit#map=" + map.getZoom() + "/" + center.lat + "/" + center.lng;
  // console.log("going to " + url);
  window.open(url, "_blank");
};
*/
