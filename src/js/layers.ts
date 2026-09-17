/**
 * @format
 */

import * as L from "leaflet";

export const layerOSMfr = L.tileLayer(
  "//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    crossOrigin: true,
    attribution:
      'Fond de plan &copy; <a href="https://openstreetmap.fr/">OpenStreetMap France</a>',
  },
);

export const layerOSM = L.tileLayer(
  "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    crossOrigin: true,
    attribution:
      'Fond de plan &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a>',
  },
);

export const layerCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    minZoom: 16,
    crossOrigin: true,
    attribution: "&copy; Cadastre",
  },
);

export const overlayCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    minZoom: 16,
    crossOrigin: true,
    attribution: "&copy; Cadastre",
  },
);

export const layerEsriWorldImagery = L.tileLayer(
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    crossOrigin: true,
    attribution:
      "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
);

export const layerEsriWorldStreetMap = L.tileLayer(
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    crossOrigin: true,
    attribution:
      "Tiles &copy; Esri &mdash; " +
      "Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  },
);

export const baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  OpenStreetMap: layerOSM,
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery,
  "World Street Map": layerEsriWorldStreetMap,
};

export const overlayMaps = {
  Cadastre: overlayCadastre,
};
