/**
 * @format
 */

import * as L from "leaflet";
import type { GeoJsonObject } from "geojson";
import { API_URL, SHORT_CITY_NAMES } from "./config";
import { getMapInstance } from "./mapContext";

import "leaflet.photon";

type PhotonFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    type?: string;
    name?: string;
    city?: string;
    context?: string;
  };
};

const searchPoints = L.geoJson(null, {
  onEachFeature: (feature: any, layer: any) => {
    layer.on("click", () => {
      const mapInstance = getMapInstance();
      if (!mapInstance) {
        return;
      }
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
      mapInstance.setView(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        zoom,
      );
    });
    const popupContent = L.DomUtil.create("div");
    popupContent.textContent = feature.properties.name;
    const link = L.DomUtil.create("a", "geo", popupContent);
    link.href = `geo:${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`;
    link.innerHTML = "<i class='zmdi-navigation zmdi-2x'></i>";
    layer.bindPopup(popupContent);
  },
});

function showSearchPoints(geojson: GeoJsonObject) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson as any);
}

function formatResult(feature: PhotonFeature, el: HTMLElement) {
  const details: string[] = [];
  const detailsContainer = L.DomUtil.create("small", "", el);
  const title = L.DomUtil.create("strong", "", el);
  const types: Record<string, string> = {
    housenumber: "numéro",
    street: "rue",
    locality: "lieu-dit",
    hamlet: "hamlet",
    village: "village",
    city: "ville",
    commune: "commune",
  };
  title.textContent = feature.properties.name ?? "";
  if (feature.properties.type && types[feature.properties.type]) {
    L.DomUtil.create("span", "type", title).textContent =
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
  detailsContainer.textContent = details.join(", ");
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
  minChar: (val: string) =>
    SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length >= 3,
  submitDelay: 200,
};

const LeafletAny = L as any;
const myPhoton = new LeafletAny.Control.Photon(photonControlOptions);

export function photon() {
  const mapInstance = getMapInstance();
  if (!mapInstance) {
    return;
  }

  searchPoints.addTo(mapInstance);
  mapInstance.addControl(myPhoton);

  myPhoton.search.__proto__.setChoice = function setChoice(choice: any) {
    const c = choice || this.RESULTS[this.CURRENT];
    if (c) {
      this.hide();
      this.input.value = "";
      this.fire("selected", { choice: c.feature });
      this.onSelected(c.feature);
    }
  };
}
