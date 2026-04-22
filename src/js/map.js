/**
 * @format
 */

import * as L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import {
  addAttributions,
  addBaseLayer,
  addHashToUrl,
  createMainMap,
  setInitialView,
} from "./mapAdapters";
import { setMapInstance } from "./mapContext";
//import { dbinfo } from "./stats"; // Stats are not working :'(
import { photon } from "./photon";
import { installReverseLabel } from "./reverseLabel";

import "leaflet-hash";
import "leaflet.browser.print/dist/leaflet.browser.print.min.js";
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

// connection à la BD:
// dbinfo(); // Stats are not working :'(

// Initialisation de leaflet
const mapInstance = createMainMap("map");
setMapInstance(mapInstance);

const layers = L.control.layers(baseMaps, overlayMaps);

L.Icon.Default.imagePath = "./images/";
addBaseLayer(mapInstance, layerOSMfr);

layers.addTo(mapInstance);

setInitialView(mapInstance, CENTER, 6);

addAttributions(mapInstance, ATTRIBUTIONS);

// ajout hash dans l'URL
addHashToUrl(mapInstance);

// Chargement des modules:
// require('./photon');
photon();
installReverseLabel();

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
