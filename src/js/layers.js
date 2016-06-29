/* global L, IGN_KEY, IGN_LAYER, IGN_LAYER_LITE */
/* eslint-disable max-len*/

// Layers
const layerOSMfr = L.tileLayer(
  "http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "Fond de plan &copy; <a href=\"http://openstreetmap.fr/\">OpenStreetMap France</a>"
  });

const layerOSM = L.tileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "Fond de plan &copy; <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>"
  });

const layerMapsurfer = L.tileLayer(
  "http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}", {
    maxZoom: 19,
    attribution: "Fond de plan &copy; <a gref=\"http://openmapsurfer.uni-hd.de/\">OpenMapSurfer</a>"
  }
);

const overlayMapsurfer = L.tileLayer(
  "http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}", {
    maxZoom: 19,
    attribution: "Surcouche &copy <a gref=\"http://openmapsurfer.uni-hd.de/\">OpenMapSurfer</a>"
  }
);

const layerBing = L.tileLayer(
  "http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    attribution: "Vue satellite &copy; <a href=\"http://bing.com/\">Bing</a> via Stamen"
  });

const layerBoner = L.tileLayer(
  "http://tile.stamen.com/boner/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    attribution: "Vue satellite &copy; <a href=\"http://bing.com/\">Bing</a> via Stamen"
  });

const layerCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png", {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre"
  });

const overlayCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png", {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre"
  });

const layerEsriWorldImagery = L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  });

const layerIGN = L.tileLayer(
  `http://wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`, {
    maxZoom: 18,
    minZoom: 6,
    attribution: "Fond de plan &copy; <a href=\"http://www.ign.fr\">IGN</a>"
  });

const layerIGNlite = L.tileLayer(
  `http://wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER_LITE}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`, {
    maxZoom: 18,
    minZoom: 6,
    attribution: "Fond de plan &copy; <a href=\"http://www.ign.fr\">IGN</a>"
  });

const layerGoogleHybrid = new L.Google("HYBRID", {
  maxZoom: 20,
  attribution: "Vue satellite &copy; <a href=\"http://www.google.com\">Google</a>"
});

const overlayBAN = L.tileLayer(
  "http://{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "Surcouche: &copy; BAN(O)"
  });

/* eslint-disable no-unused-vars */
const baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  OpenStreetMap: layerOSM,
  "Carte IGN": layerIGN,
  "Plan IGN": layerIGNlite,
  MapSurfer: layerMapsurfer,
  Bing: layerBing,
  "Bing+OSM": layerBoner,
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery,
  "Google Sat": layerGoogleHybrid
};

const overlayMaps = {
  Cadastre: overlayCadastre,
  "BAN(O)": overlayBAN,
  MapSurfer: overlayMapsurfer
};
/* eslint-enable no-unused-vars */
/* eslint-enable max-len */
