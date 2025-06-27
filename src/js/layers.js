/**
 * @format
 */

import L from "leaflet";
import { IGN_KEY, IGN_LAYER } from "./config";

// Définition des fonds de carte principaux
export const layerOSMfr = L.tileLayer(
  "//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      'Fond de plan &copy; <a href="https://openstreetmap.fr/">OpenStreetMap France</a>',
  }
);

export const layerOSM = L.tileLayer(
  "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      'Fond de plan &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a>',
  }
);

export const layerCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre",
  }
);

export const overlayCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre",
  }
);

export const layerEsriWorldImagery = L.tileLayer(
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

export const layerEsriWorldStreetMap = L.tileLayer(
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      'Tiles &copy; Esri &mdash; ' +
      'Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  }
);

export const layerIGN = L.tileLayer(
  `//data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER}&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,
  {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'IGN-F/Géoportail',
    tileSize: 256, // tuiles 256x256px
  }
);

export const overlayBAN = L.tileLayer(
  "//{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution: "Surcouche: &copy; BAN(O)",
  }
);

// Groupes de fonds de carte et surcouches
export const baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  OpenStreetMap: layerOSM,
  // "Carte IGN": layerIGN, // clé IGN non renouvelée
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery,
  "World Street Map": layerEsriWorldStreetMap,
};

export const overlayMaps = {
  Cadastre: overlayCadastre,
  "BAN(O)": overlayBAN,
};
