/**
 * @format
 */

import L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
//import { dbinfo } from "./stats"; // Stats are not working :'(
import { photon } from "./photon";

require("leaflet-hash");
require("leaflet.browser.print/dist/leaflet.browser.print.min.js");
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

// connection à la BD:
// dbinfo(); // Stats are not working :'(

// Initialisation de leaflet
window.map = L.map("map", {
  attributionControl: false,
});

const layers = L.control.layers(baseMaps, overlayMaps);

L.Icon.Default.imagePath = "./images/";
window.map.addLayer(layerOSMfr);

layers.addTo(window.map);

window.map.setView(CENTER, 6);

window.map.dragging.enable();

L.control
  .attribution({
    position: "bottomleft",
    prefix: ATTRIBUTIONS,
  })
  .addTo(window.map);

// ajout hash dans l'URL
// let hash;
new L.Hash(window.map);

// Chargement des modules:
// require('./photon');
photon();
require.ensure(["./reverseLabel"], function () {
  require("./reverseLabel");
});

//require ("./geoloc.js")

// ajout du bouton print
/*L.control
  .browserPrint({
    printModes: [
      //L.control.browserPrint.mode.portrait("Portrait", "A4"),
      //L.control.browserPrint.mode.landscape("Paysage", "A4"),
      L.control.browserPrint.mode.auto("Auto", "A4"),
      L.control.browserPrint.mode.custom("Séléctionnez la zone", "A4"),
    ],
  })
  .addTo(window.map);
*/
