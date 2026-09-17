/**
 * @format
 */

import * as L from "leaflet";
import type { GeoJsonObject } from "geojson";
import type {
  PhotonControlOptions,
  PhotonFeature,
  PhotonFeatureType,
  PhotonSearchChoice,
} from "../../types/leaflet-plugins";
import { API_URL, SHORT_CITY_NAMES } from "./config";

import "leaflet.photon";

let activeMap: L.Map | null = null;

const ZOOM_BY_FEATURE_TYPE = {
  housenumber: 18,
  street: 16,
  locality: 16,
  hamlet: 16,
  village: 12,
  city: 12,
  commune: 12,
} as const satisfies Record<PhotonFeatureType, number>;

const FEATURE_TYPE_LABELS = {
  housenumber: "numéro",
  street: "rue",
  locality: "lieu-dit",
  hamlet: "hamlet",
  village: "village",
  city: "ville",
  commune: "commune",
} as const satisfies Record<PhotonFeatureType, string>;

const searchPoints = L.geoJson(null, {
  onEachFeature: (feature: PhotonFeature, layer: L.Layer) => {
    layer.on("click", () => {
      if (!activeMap) {
        return;
      }
      const zoom =
        (feature.properties.type &&
          ZOOM_BY_FEATURE_TYPE[feature.properties.type]) ??
        16;
      activeMap.setView(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        zoom,
      );
    });
    const popupContent = L.DomUtil.create("div");
    popupContent.textContent = feature.properties.name ?? "";
    const link = L.DomUtil.create("a", "geo", popupContent);
    link.href = `geo:${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`;
    link.innerHTML = "<i class='zmdi-navigation zmdi-2x'></i>";
    layer.bindPopup(popupContent);
  },
});

function showSearchPoints(geojson: GeoJsonObject) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
}

function formatResult(feature: PhotonFeature, el: HTMLElement) {
  const details: string[] = [];
  const detailsContainer = L.DomUtil.create("small", "", el);
  const title = L.DomUtil.create("strong", "", el);
  title.textContent = feature.properties.name ?? "";
  if (feature.properties.type && FEATURE_TYPE_LABELS[feature.properties.type]) {
    L.DomUtil.create("span", "type", title).textContent =
      FEATURE_TYPE_LABELS[feature.properties.type];
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

const photonControlOptions: PhotonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: API_URL,
  formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "julien.noblet+cad-killer@gmail.com",
  minChar: (val: string) => SHORT_CITY_NAMES.has(val) || val.length >= 3,
  submitDelay: 200,
};

const PhotonControl =
  (typeof window !== "undefined" && window.L?.Control?.Photon) ||
  L.Control.Photon;
const myPhoton = new PhotonControl(photonControlOptions);

export function photon(mapInstance: L.Map) {
  if (!mapInstance) {
    return;
  }
  activeMap = mapInstance;

  searchPoints.addTo(mapInstance);
  mapInstance.addControl(myPhoton);

  const searchProto = Object.getPrototypeOf(myPhoton.search);
  searchProto.setChoice = function setChoice(
    this: typeof myPhoton.search,
    choice?: PhotonSearchChoice,
  ) {
    const c = choice || this.RESULTS[this.CURRENT];
    if (c) {
      this.hide();
      this.input.value = "";
      this.fire("selected", { choice: c.feature });
      this.onSelected(c.feature);
    }
  };
}
