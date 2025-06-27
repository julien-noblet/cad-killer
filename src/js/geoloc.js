/**
 * Contrôle de géolocalisation Leaflet amélioré
 * Fournit un contrôle personnalisé pour centrer la carte sur la position de l'utilisateur.
 * @module geoloc
 */

import L from "leaflet";

/**
 * Centre la carte sur la position fournie et met à jour l'icône.
 * @param {GeolocationPosition} position
 */
function showPosition(position) {
  const icon = document.getElementById("geoloc_icon");
  if (window.map) {
    window.map.setView([
      position.coords.latitude,
      position.coords.longitude,
    ], 16);
    if (icon) icon.className = "zmdi zmdi-2x zmdi-gps-dot";
  }
}

/**
 * Gère l'échec de la géolocalisation et met à jour l'icône.
 * @param {GeolocationPositionError} err
 */
function handleGeolocError(err) {
  const icon = document.getElementById("geoloc_icon");
  if (icon) icon.className = "zmdi zmdi-2x zmdi-gps-off";
  // Affichage optionnel d'une notification d'erreur
  // alert('Erreur de géolocalisation : ' + err.message);
}

/**
 * Demande la position de l'utilisateur et met à jour l'icône.
 */
export function getLocation() {
  const icon = document.getElementById("geoloc_icon");
  if (navigator.geolocation) {
    if (icon) icon.className = "zmdi zmdi-2x zmdi-gps";
    navigator.geolocation.getCurrentPosition(showPosition, handleGeolocError);
  } else {
    handleGeolocError({ message: "Géolocalisation non supportée" });
  }
}

/**
 * Contrôle Leaflet pour la géolocalisation
 */
export class GeoLocControl extends L.Control {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    super({ position: "topright", ...options });
  }
  onAdd() {
    const container = L.DomUtil.create("div", "leaflet-control-geoloc");
    container.innerHTML =
      '<span id="geoloc" class="geoloc"><i class="zmdi zmdi-2x zmdi-gps-off" id="geoloc_icon"></i></span>';
    container.addEventListener("click", getLocation);
    return container;
  }
}

/**
 * Ajoute le contrôle de géolocalisation à la carte si elle existe.
 * @param {L.Map} map
 */
export function addGeoLocControlToMap(map) {
  if (map) {
    map.addControl(new GeoLocControl());
  }
}

// Pour compatibilité avec l'ancien code global
if (window.map) {
  addGeoLocControlToMap(window.map);
}
