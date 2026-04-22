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
import { photon } from "./photon";
import { installReverseLabel } from "./reverseLabel";

import "leaflet-hash";
import "leaflet.browser.print/dist/leaflet.browser.print.min.js";

const mapInstance = createMainMap("map");
setMapInstance(mapInstance);

const layers = L.control.layers(baseMaps, overlayMaps);

L.Icon.Default.imagePath = "./images/";
addBaseLayer(mapInstance, layerOSMfr);

layers.addTo(mapInstance);

setInitialView(mapInstance, CENTER, 6);

addAttributions(mapInstance, ATTRIBUTIONS);
addHashToUrl(mapInstance);

photon();
installReverseLabel();
