/**
 * @flow
 *
 * @format
 */

import L from "leaflet";
import { IGN_KEY, IGN_LAYER, IGN_LAYER_LITE, IGN_ORTHO } from "./config";

// Layers
export const layerOSMfr: any = L.tileLayer(
  "//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      'Fond de plan &copy; <a href="https://openstreetmap.fr/">OpenStreetMap France</a>',
  }
);

export const layerOSM: any = L.tileLayer(
  "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      'Fond de plan &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a>',
  }
);



export const layerBing: any = L.tileLayer(
  "http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg",
  {
    maxZoom: 18,
    attribution:
      'Vue satellite &copy; <a href="https://bing.com/">Bing</a> via Stamen',
  }
);

export const layerBoner: any = L.tileLayer(
  "http://tile.stamen.com/boner/{z}/{x}/{y}.jpg",
  {
    maxZoom: 18,
    attribution:
      'Vue satellite &copy; <a href="https://bing.com/">Bing</a> via Stamen',
  }
);

export const layerCadastre: any = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre",
  }
);

export const overlayCadastre: any = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre",
  }
);

export const layerEsriWorldImagery: any = L.tileLayer(
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

export const layerIGN: any = L.tileLayer(
  `//wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`,
  {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'IGN-F/Géoportail',
  }
);

export const layerIGNlite: any = L.tileLayer(
  `//wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER_LITE}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`,
  {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'IGN-F/Géoportail',
  }
);

export const layerIGNortho: any = L.tileLayer(
  `//wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_ORTHO}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`,
  {
    maxZoom: 18,
    minZoom: 0,
    attribution: 'IGN-F/Géoportail',
  }
);

export const overlayBAN: any = L.tileLayer(
  "//{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution: "Surcouche: &copy; BAN(O)",
  }
);

export const baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  OpenStreetMap: layerOSM,
  "Carte IGN": layerIGN,
  "Plan IGN": layerIGNlite,
  "Orthophoto IGN": layerIGNortho,
  Bing: layerBing,
  "Bing+OSM": layerBoner,
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery,
};

export const overlayMaps = {
  Cadastre: overlayCadastre,
  "BAN(O)": overlayBAN,
};
