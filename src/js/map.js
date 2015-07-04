/*global L,
  ATTRIBUTIONS,
  CENTER,
  GeoLoc,
  overlayMaps,
  ga,
  baseMaps,
  layerOSMfr,
  photonControlOptions,
  searchPoints,
  notesControl
   */
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var map = L.map("map", {
  attributionControl: false
});


var layers = L.control.layers(baseMaps, overlayMaps);
var myPhoton = new L.Control.Photon(photonControlOptions);

// ajout hash dans l'URL
/*eslint-disable no-unused-vars */
var hash = new L.Hash(map);
/*eslint-enable no-unused-vars */

L.Icon.Default.imagePath = "./images";
map.addLayer(layerOSMfr);

map.addControl(myPhoton);

/*eslint-disable no-proto */
myPhoton.search.__proto__.setChoice = function(choice) {
  "use strict";
  choice = choice || this.RESULTS[this.CURRENT];
  if (choice) {
    ga("send", "event", "element", "select", choice.feature.properties.label + " / " + choice.feature.properties.context);
    this.hide();
    this.input.value = "";
    this.fire("selected", {
      choice: choice.feature
    });
    this.onSelected(choice.feature);
  }
};
/*eslint-enable no-proto*/

layers.addTo(map);

map.setView(CENTER, 6);
searchPoints.addTo(map);

L.control.attribution({
  position: "bottomleft",
  prefix: ATTRIBUTIONS
}).addTo(map);

new L.Control.ReverseLabel().addTo(map);

map.addControl(new GeoLoc());

map.addControl(notesControl);

//layers.addOverlay(notesItems, "Ma note");
