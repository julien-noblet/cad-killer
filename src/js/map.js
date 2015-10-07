/* global L,
  ATTRIBUTIONS,
  CENTER,
  overlayMaps,
  baseMaps,
  layerOSMfr,
  sendMove
*/
"use strict";

/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var map = L.map("map", {
  attributionControl: false
});


var layers = L.control.layers(baseMaps, overlayMaps);
/* eslint-disable no-unused-vars */
var hash;
/* eslint-enable no-unused-vars */


L.Icon.Default.imagePath = "./images";
map.addLayer(layerOSMfr);

layers.addTo(map);

map.setView(CENTER, 6);

L.control.attribution({
  position: "bottomleft",
  prefix: ATTRIBUTIONS
}).addTo(map);

// ajout hash dans l'URL
hash = new L.Hash(map);

map.on("moveend", function() {
  sendMove({
    lat: map.getCenter().lat,
    lng: map.getCenter().lng,
    zoom: map.getZoom()
  });
});
