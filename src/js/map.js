/* @flow */

import L from "leaflet";
import { ATTRIBUTIONS, CENTER, REVERSE_URL } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import { dbinfo, sendLayer } from "./stats";
import { photon } from "./photon";

require("leaflet-hash");

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

// Chargement des modules:
// require('./photon');
require("./reverseLabel");
require("./notes");
photon();

/*
  Si l'on change de layer (base) -> j'envoie un objet:
  {
    layer: '',
    city: '',
    location: {lat,lng,zoom}
  }

  Nota: est-ce qu je doit déplacer cela dans stats.js?
 */

function onSwitchLayer(layer, switchCase: string): void {
  const url = `${REVERSE_URL}lon=${Window.map.getCenter()
    .lng}&lat=${Window.map.getCenter().lat}`;

  L.Util.ajax(url).then(function(data): void {
    let city: string = "";
    let postcode: string = "";
    if (data.features[0] !== null) {
      city = data.features[0].properties.city;
      postcode = data.features[0].properties.postcode;
    }
    sendLayer({
      layer,
      switchCase,
      city,
      postcode,
      location: {
        lat: Window.map.getCenter().lat,
        lng: Window.map.getCenter().lng,
        zoom: Window.map.getZoom()
      }
    });
  });
}

Window.map.on("baselayerchange", function(e): void {
  onSwitchLayer(e.name, "switch");
});

Window.map.on("overlayadd", function(e): void {
  onSwitchLayer(e.name, "add-overlay");
});

Window.map.on("overlayremove", function(e): void {
  onSwitchLayer(e.name, "remove-overlay");
});
