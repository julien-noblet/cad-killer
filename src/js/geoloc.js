/**
 * Contrôle de géolocalisation Leaflet moderne, accessible et testable
 * Fournit un contrôle personnalisé pour centrer la carte sur la position de l'utilisateur.
 * @module geoloc
 */

import L from "leaflet";

// Classes CSS pour l'icône de géolocalisation
const GEOLOC_ICON_CLASSES = Object.freeze({
  default: "zmdi zmdi-2x zmdi-gps-off",
  active: "zmdi zmdi-2x zmdi-gps",
  success: "zmdi zmdi-2x zmdi-gps-dot",
  error: "zmdi zmdi-2x zmdi-gps-off",
});

// Libellés et messages d'accessibilité
const GEOLOC_LABEL = "Centrer la carte sur ma position";
const GEOLOC_ERROR_MSG = "Erreur de géolocalisation";
const GEOLOC_UNSUPPORTED_MSG = "Géolocalisation non supportée";

/**
 * Met à jour l'icône de géolocalisation selon l'état.
 * @param {('default'|'active'|'success'|'error')} state
 */
function updateGeolocIcon(state = "default") {
  const icon = document.getElementById("geoloc_icon");
  if (icon) {
    icon.className = GEOLOC_ICON_CLASSES[state] || GEOLOC_ICON_CLASSES.default;
  }
}

/**
 * Affiche une notification utilisateur (à améliorer selon l'UI du projet)
 * @param {string} message
 */
function notifyUser(message) {
  if (window?.console?.warn) {
    window.console.warn(message);
  }
  // TODO: Remplacer par une notification visuelle élégante si besoin
}

/**
 * Centre la carte sur la position fournie et met à jour l'icône de géolocalisation.
 * @param {GeolocationPosition} position
 */
function centerMapOnPosition(position) {
  const { latitude, longitude } = position?.coords || {};
  if (
    typeof window !== "undefined" &&
    window.map &&
    typeof latitude === "number" &&
    typeof longitude === "number"
  ) {
    window.map.setView([latitude, longitude], 16);
    updateGeolocIcon("success");
  } else {
    updateGeolocIcon("error");
    notifyUser(GEOLOC_ERROR_MSG);
  }
}

/**
 * Gère l'échec de la géolocalisation et met à jour l'icône de géolocalisation.
 * @param {GeolocationPositionError|Object} error
 */
function handleGeolocationError(error) {
  updateGeolocIcon("error");
  const msg = error?.message || GEOLOC_ERROR_MSG;
  notifyUser(`${GEOLOC_ERROR_MSG} : ${msg}`);
}

/**
 * Demande la position de l'utilisateur et met à jour l'icône de géolocalisation.
 * Peut être mockée pour les tests.
 */
export function getLocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    handleGeolocationError({ message: GEOLOC_UNSUPPORTED_MSG });
    return;
  }
  updateGeolocIcon("active");
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
      `<span id="geoloc" class="geoloc"><i class="${GEOLOC_ICON_CLASSES.default}" id="geoloc_icon" aria-label="Géolocalisation"></i></span>`;
    container.title = GEOLOC_LABEL;
    container.style.cursor = "pointer";
    container.tabIndex = 0;
    container.setAttribute("role", "button");
    container.setAttribute("aria-pressed", "false");
    container.setAttribute("aria-label", GEOLOC_LABEL);
    container.addEventListener("click", getLocation);
    container.addEventListener("keydown", (e) => {
      if (["Enter", " "].includes(e.key)) {
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
if (typeof window !== "undefined" && window.map) {
  addGeoLocControlToMap(window.map);
}
