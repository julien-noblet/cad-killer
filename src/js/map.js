/**
 * Initialisation et configuration de la carte Leaflet principale
 * @module map
 */

import L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";
import { photon } from "./photon";

const MAP_ELEMENT_ID = "map";
const DOM_CONTENT_LOADED = "DOMContentLoaded";

/**
 * Sélectionne l'élément DOM pour la carte Leaflet.
 * @returns {HTMLElement}
 * @throws {ReferenceError} Si l'élément n'est pas trouvé ou n'est pas un HTMLElement
 */
export function getMapElement() {
  const el = document.getElementById(MAP_ELEMENT_ID);
  if (!(el instanceof HTMLElement)) {
    throw new ReferenceError(`L'élément #${MAP_ELEMENT_ID} est introuvable dans le DOM ou n'est pas un HTMLElement.`);
  }
  return el;
}

/**
 * Initialise la carte Leaflet et configure les contrôles principaux.
 * @param {HTMLElement} element
 * @returns {L.Map}
 * @throws {TypeError} Si l'élément DOM est invalide
 */
export function initializeMap(element) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError("L'élément DOM passé à initializeMap est invalide.");
  }
  const map = L.map(element, { attributionControl: false });
  L.Icon.Default.imagePath = "./images/";
  map.addLayer(layerOSMfr);
  L.control.layers(baseMaps, overlayMaps).addTo(map);
  map.setView(CENTER, 6);
  map.dragging.enable();
  L.control.attribution({ position: "bottomleft", prefix: ATTRIBUTIONS }).addTo(map);
  if (typeof L.Hash === "function") new L.Hash(map);
  return map;
}

/**
 * Bootstrap asynchrone de la carte et des modules complémentaires.
 * Séparé pour faciliter les tests et la maintenabilité.
 * Initialise la carte et charge les modules complémentaires après le DOMContentLoaded.
 * Gère les erreurs d'initialisation et de chargement des modules.
 */
export async function bootstrapMap() {
  try {
    const mapElement = getMapElement();
    window.map = initializeMap(mapElement);
  } catch (error) {
    console.error("Erreur d'initialisation de la carte:", error);
    return;
  }
  window.addEventListener(DOM_CONTENT_LOADED, async () => {
    try {
      photon();
      await import("./reverseLabel");
    } catch (err) {
      console.error("Erreur lors du chargement des modules complémentaires:", err);
    }
  });
}

// Initialisation automatique si ce module est chargé directement
if (typeof window !== 'undefined') {
  bootstrapMap();
}