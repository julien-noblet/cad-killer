/**
 * @format
 * Module de recherche Photon pour Leaflet
 */

import L from "leaflet";
import { API_URL, SHORT_CITY_NAMES } from "./config";

require("leaflet.photon");

/**
 * Gère l'affichage des points de recherche sur la carte.
 * @param {GeoJSON.FeatureCollection} geojson
 */
const searchPoints = L.geoJson(null, {
  onEachFeature: (feature, layer) => {
    layer.on("click", () => {
      let zoom = 16;
      switch (feature?.properties?.type) {
        case "housenumber":
          zoom = 18;
          break;
        case "street":
        case "locality":
        case "hamlet":
          zoom = 16;
          break;
        case "village":
        case "city":
        case "commune":
          zoom = 12;
          break;
        default:
          zoom = 16;
      }
      window.map.setView([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ], zoom);
    });
    layer.bindPopup(
      `${feature.properties.name}<a class='geo' href='geo:${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}'><i class='zmdi-navigation zmdi-2x'></i></a>`
    );
  },
});

/**
 * Affiche les points de recherche sur la carte.
 * @param {GeoJSON.FeatureCollection} geojson
 */
const showSearchPoints = (geojson) => {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
};

/**
 * Formate le résultat de recherche pour l'affichage dans la liste.
 * @param {object} feature
 * @param {HTMLElement} el
 */
const formatResult = (feature, el) => {
  const details = [];
  const detailsContainer = L.DomUtil.create("small", "", el);
  const title = L.DomUtil.create("strong", "", el);
  const types = {
    housenumber: "numéro",
    street: "rue",
    locality: "lieu-dit",
    hamlet: "hameau",
    village: "village",
    city: "ville",
    commune: "commune",
  };
  title.innerHTML = feature.properties.name;
  if (types[feature.properties.type]) {
    L.DomUtil.create("span", "type", title).innerHTML = types[feature.properties.type];
  }
  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) {
    details.push(feature.properties.context);
  }
  detailsContainer.innerHTML = details.join(", ");
};

const photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: API_URL,
  formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "julien.noblet+cad-killer@gmail.com",
  minChar: (val) => SHORT_CITY_NAMES.includes(val) || val.length >= 3,
  submitDelay: 200,
};

const myPhoton = new L.Control.Photon(photonControlOptions);

/**
 * Initialise le contrôle Photon sur la carte globale.
 */
export function photon() {
  searchPoints.addTo(window.map);
  window.map.addControl(myPhoton);
  // Patch pour permettre la sélection par touche Entrée
  if (myPhoton.search && Object.getPrototypeOf(myPhoton.search)) {
    Object.getPrototypeOf(myPhoton.search).setChoice = function setChoice(choice) {
      const c = choice || this.RESULTS[this.CURRENT];
      if (c) {
        this.hide();
        this.input.value = "";
        this.fire("selected", { choice: c.feature });
        this.onSelected(c.feature);
      }
    };
  }
}
