/**
 * Contrôle de géolocalisation Leaflet amélioré
 * Fournit un contrôle personnalisé pour centrer la carte sur la position de l'utilisateur.
 * @module geoloc
 */

import L from "leaflet";

/**
 * Met à jour l'icône de géolocalisation selon l'état.
 * @param {('default'|'active'|'success'|'error')} state
 */
function updateGeolocIcon(state = 'default') {
  const icon = document.getElementById("geoloc_icon");
  if (!icon) return;
  const states = {
    default: "zmdi zmdi-2x zmdi-gps-off",
    active: "zmdi zmdi-2x zmdi-gps",
    success: "zmdi zmdi-2x zmdi-gps-dot",
    error: "zmdi zmdi-2x zmdi-gps-off",
  };
  icon.className = states[state] || states.default;
}

/**
 * Centre la carte sur la position fournie et met à jour l'icône de géolocalisation.
 * @param {GeolocationPosition} position
 */
function centerMapOnPosition(position) {
  if (
    window.map &&
    position &&
    position.coords &&
    typeof position.coords.latitude === 'number' &&
    typeof position.coords.longitude === 'number'
  ) {
    window.map.setView([
      position.coords.latitude,
      position.coords.longitude,
    ], 16);
    updateGeolocIcon('success');
  } else {
    updateGeolocIcon('error');
    // Optionnel: log ou notification
  }
}

/**
 * Gère l'échec de la géolocalisation et met à jour l'icône de géolocalisation.
 * @param {GeolocationPositionError|Object} error
 */
function handleGeolocationError(error) {
  updateGeolocIcon('error');
  if (error && error.message) {
    // TODO: Remplacer par une notification utilisateur élégante
    if (window.console && window.console.warn) {
      window.console.warn(`Erreur de géolocalisation : ${error.message}`);
    }
  }
}

/**
 * Demande la position de l'utilisateur et met à jour l'icône de géolocalisation.
 * Peut être mockée pour les tests.
 * @returns {void}
 */
export function getLocation() {
  if (!navigator.geolocation) {
    handleGeolocationError({ message: "Géolocalisation non supportée" });
    return;
  }
  updateGeolocIcon('active');
  navigator.geolocation.getCurrentPosition(centerMapOnPosition, handleGeolocationError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
}

/**
 * Contrôle Leaflet personnalisé pour la géolocalisation.
 * Permet d'ajouter un bouton de géolocalisation sur la carte.
 */
export class GeoLocControl extends L.Control {
  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    super({ position: "topright", ...options });
  }

  onAdd() {
    const container = L.DomUtil.create("div", "leaflet-control-geoloc");
    container.innerHTML =
      '<span id="geoloc" class="geoloc"><i class="zmdi zmdi-2x zmdi-gps-off" id="geoloc_icon" aria-label="Géolocalisation"></i></span>';
    container.title = "Centrer la carte sur ma position";
    container.style.cursor = "pointer";
    container.addEventListener("click", getLocation);
    // Accessibilité : focusable
    container.tabIndex = 0;
    container.setAttribute('role', 'button');
    container.setAttribute('aria-pressed', 'false');
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        getLocation();
      }
    });
    return container;
  }
}

/**
 * Ajoute le contrôle de géolocalisation à la carte si elle existe.
 * @param {L.Map} map
 */
export function addGeoLocControlToMap(map) {
  if (map && !map._geolocControlAdded) {
    map.addControl(new GeoLocControl());
    map._geolocControlAdded = true;
  }
}

// Ajout automatique du contrôle si window.map existe (pour compatibilité)
if (window.map) {
  addGeoLocControlToMap(window.map);
}
