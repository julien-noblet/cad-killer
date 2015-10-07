/*global L,
  ATTRIBUTIONS,
  CENTER,
  overlayMaps,
  ga,
  baseMaps,
  layerOSMfr
*/

/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var map = L.map("map", {
  attributionControl: false
});


var layers = L.control.layers(baseMaps, overlayMaps);

var hash;


L.Icon.Default.imagePath = "./images";
map.addLayer(layerOSMfr);

layers.addTo(map);

map.setView(CENTER, 6);

L.control.attribution({
  position: "bottomleft",
  prefix: ATTRIBUTIONS
}).addTo(map);

// ajout hash dans l'URL
/*eslint-disable no-unused-vars */
hash = new L.Hash(map);
/*eslint-enable no-unused-vars */

map.on("moveend", function(){
  "use strict";
  sendMove({"lat": map.getCenter().lat, "lng":map.getCenter().lng }); //zoom???
  //ga("send", "event", "map", "move", "Move : Lat: " + map.getCenter().lat + " Lon: " + map.getCenter().lng );
});
