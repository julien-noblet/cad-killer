/**
 * @flow
 *
 * @format
 */

import * as L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
//import { dbinfo } from "./stats"; // Stats are not working :'(
import { photon } from "./photon";

import * as LH from "leaflet-hash";
//import "leaflet.browser.print/dist/leaflet.browser.print.min.js";
//import './reverseLabel'
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

// connection à la BD:
// dbinfo(); // Stats are not working :'(

// Initialisation de leaflet
export const mymap = L.map("map", {
  attributionControl: false,
});

const layers = L.control.layers(baseMaps, overlayMaps);

L.Icon.Default.imagePath = "./images/";
mymap.addLayer(layerOSMfr);

layers.addTo(mymap);

mymap.setView(CENTER, 6);

mymap.dragging.enable();

L.control
  .attribution({
    position: "bottomleft",
    prefix: ATTRIBUTIONS,
  })
  .addTo(mymap);

// ajout hash dans l'URL
let hash;
hash = new  LH.Hash(mymap);



// Chargement des modules:
// require('./photon');
photon();
/*require.ensure(["./reverseLabel"], function () {
  require("./reverseLabel");
});
/*
/*
// Removing notes because seems not working!
// The loading of L.Draw cause also some fails with Jest!
require.ensure(["./notes"], function() {
  require("./notes");
});
*/
//require ("./geoloc.js")

// ajout du bouton print
/*L.control
  .browserPrint({
    printModes: [
      //L.control.browserPrint.mode.portrait("Portrait", "A4"),
      L.control.browserPrint.mode.landscape("Paysage", "A4"),
      L.control.browserPrint.mode.auto("Auto", "A4"),
      L.control.browserPrint.mode.custom("Séléctionnez la zone", "A4"),
    ],
  })
  .addTo(map);
*/