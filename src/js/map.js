/* @flow */

import L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import { dbinfo } from "./stats";
import { photon } from "./photon";

require("leaflet-hash");
require("leaflet.browser.print/dist/leaflet.browser.print.min.js");

/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

// connection à la BD:
dbinfo();

// Initialisation de leaflet
Window.map = L.map("map", {
  attributionControl: false
});

const layers = L.control.layers(baseMaps, overlayMaps);

L.Icon.Default.imagePath = "./images/";
Window.map.addLayer(layerOSMfr);

layers.addTo(Window.map);

Window.map.setView(CENTER, 6);

Window.map.dragging.enable();

L.control
  .attribution({
    position: "bottomleft",
    prefix: ATTRIBUTIONS
  })
  .addTo(Window.map);

// ajout hash dans l'URL
let hash;
hash = new L.Hash(Window.map);

// ajout du bouton print
L.browserPrint({
  printModesNames: {
    Portrait: "Portrait",
    Landscape: "Paysage",
    Auto: "Auto",
    Custom: "Séléctionnez la zone"
  }
}).addTo(Window.map);

// Chargement des modules:
// require('./photon');
photon();
require("./reverseLabel");
// require("./notes"); // Get somes issues, removing...
