/**
 * Initialisation et configuration de la carte Leaflet principale
 * @module map
 */

import L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import { photon } from "./photon";

require("leaflet-hash");
require("leaflet.browser.print/dist/leaflet.browser.print.min.js");

/**
 * Sélectionne l'élément DOM pour la carte et lève une erreur explicite si absent.
 * @returns {HTMLElement}
 */
const getMapElement = () => {
  const el = document.getElementById("map");
  if (!el) throw new Error("L'élément #map est introuvable dans le DOM.");
  return el;
};

/**
 * Initialise la carte Leaflet et configure les contrôles principaux.
 * @param {HTMLElement} element
 * @returns {L.Map}
 */
const initializeMap = (element) => {
  const map = L.map(element, { attributionControl: false });
  L.Icon.Default.imagePath = "./images/";
  map.addLayer(layerOSMfr);
  L.control.layers(baseMaps, overlayMaps).addTo(map);
  map.setView(CENTER, 6);
  map.dragging.enable();
  L.control.attribution({ position: "bottomleft", prefix: ATTRIBUTIONS }).addTo(map);
  if (typeof L.Hash === "function") new L.Hash(map);
  return map;
};

window.map = initializeMap(getMapElement());

// Chargement asynchrone des modules complémentaires
window.addEventListener("DOMContentLoaded", async () => {
  try {
    photon();
    await import("./reverseLabel");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Erreur lors du chargement des modules complémentaires:", err);
  }
});