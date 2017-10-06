/* @flow */

import L from "leaflet";
import { API_URL, SHORT_CITY_NAMES } from "./config";
import { sendClick, sendSearch } from "./stats";

require("leaflet.photon");
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

const searchPoints = L.geoJson(null, {
  onEachFeature: (feature, layer) => {
    layer.on("click", () => {
      let zoom = 16;
      switch (feature.properties.type) {
        case "housenumber":
          zoom = 18;
          break;
        case "street":
          zoom = 16;
          break;
        case "village":
          zoom = 12;
          break;
        case "city":
          zoom = 12;
          break;
        case "locality":
          zoom = 16;
          break;
        case "hamlet":
          zoom = 16;
          break;
        case "commune":
          zoom = 12;
          break;
        default:
          zoom = 16;
      }
      Window.map.setView(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        zoom
      );
      sendClick(feature);
    });
    layer.bindPopup(
      `${feature.properties.name}<a class='geo' href='geo:${feature.geometry
        .coordinates[1]},${feature.geometry
        .coordinates[0]}'><i class='zmdi-navigation zmdi-2x'></i></a>`
    );
  }
});

function showSearchPoints(geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
}

function formatResult(feature, el) {
  const details = [];
  const detailsContainer = L.DomUtil.create("small", "", el);
  const title = L.DomUtil.create("strong", "", el);
  const types = {
    housenumber: "numéro",
    street: "rue",
    locality: "lieu-dit",
    hamlet: "hamlet", // TODO: Hameau?
    village: "village",
    city: "ville",
    commune: "commune"
  };
  title.innerHTML = feature.properties.name;
  if (types[feature.properties.type]) {
    L.DomUtil.create("span", "type", title).innerHTML =
      types[feature.properties.type];
  }
  if (
    feature.properties.city &&
    feature.properties.city !== feature.properties.name
  ) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) {
    details.push(feature.properties.context);
  }
  detailsContainer.innerHTML = details.join(", ");
}

const photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: API_URL,
  formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "julien.noblet+cad-killer@gmail.com",
  minChar: val => SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length >= 3,
  submitDelay: 200
};

/*
// not need
const photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: "topleft",
  url: REVERSE_URL,
  formatResult,
  noResultLabel: "Aucun résultat",
  tooltipLabel: "Cliquer sur la carte pour obtenir l'adresse"
};
*/

const myPhoton = new L.Control.Photon(photonControlOptions);

export function photon() {
  searchPoints.addTo(Window.map);

  Window.map.addControl(myPhoton);
  /* eslint-disable no-proto */
  myPhoton.search.__proto__.setChoice = function setChoice(choice) {
    const c = choice || this.RESULTS[this.CURRENT];
    if (c) {
      sendSearch(c.feature);
      this.hide();
      this.input.value = "";
      this.fire("selected", { choice: c.feature });
      this.onSelected(c.feature);
    }
  };
  /* eslint-enable no-proto*/
}
