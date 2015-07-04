/*global L, IGN_KEY, IGN_LAYER, IGN_LAYER_LITE */

// Layers
var layerOSMfr = L.tileLayer(
  "http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "Fond de plan &copy; <a href=\"http://openstreetmap.fr/\">OpenStreetMap France</a>"
  });

var layerOSM = L.tileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "Fond de plan &copy; <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>"
  });
/*
var layerThunderforest = L.tileLayer(
  "http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "Fond de plan &copy; Tiles Courtesy of <a href=\"http://thunderforest.com/\">Andy Allan</a>"
  });
*/

var layerBing = L.tileLayer(
  "http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    attribution: "Vue satellite &copy; <a href=\"http://bing.com/\">Bing</a> via Stamen"
  });

var layerBoner = L.tileLayer(
  "http://tile.stamen.com/boner/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    attribution: "Vue satellite &copy; <a href=\"http://bing.com/\">Bing</a> via Stamen"
  });

var layerCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png", {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre"
  });

var overlayCadastre = L.tileLayer(
  "http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png", {
    maxZoom: 22,
    minZoom: 16,
    attribution: "&copy; Cadastre"
  });

var layerEsriWorldImagery = L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  });
/*
var layerMapboxDigiglobe = L.tileLayer(
  "http://{s}.tiles.mapbox.com/v3/openstreetmap.map-4wvf9l0l/{z}/{x}/{y}.png", {
    attribution: "&copy; Mapbox"
  });
*/
/*
var layerMapboxHybrid = L.tileLayer(
  "http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{y}/{x}.png", {
    subdomains: "1234",
    attribution: "Tiles Courtesy of <a href=\"http://www.mapquest.com/\" target=\"_blank\">MapQuest</a> <img src=\"http://developer.mapquest.com/content/osm/mq_logo.png\">"
  });
*/
var layerIGN = L.tileLayer(
  "http://wxs.ign.fr/" + IGN_KEY + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" + IGN_LAYER + "&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg", {
    maxZoom: 18,
    minZoom: 6,
    attribution: "Fond de plan &copy; <a href=\"http://www.ign.fr\">IGN</a>"
  });

var layerIGNlite = L.tileLayer(
  "http://wxs.ign.fr/" + IGN_KEY + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" + IGN_LAYER_LITE + "&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg", {
    maxZoom: 18,
    minZoom: 6,
    attribution: "Fond de plan &copy; <a href=\"http://www.ign.fr\">IGN</a>"
  });
/*
var layerGoogle = new L.Google("ROADMAP", {
  maxZoom: 20,
  attribution: "Fond de plan &copy; <a href=\"http://www.google.com\">Google</a>"
});
*/
var layerGoogleHybrid = new L.Google("HYBRID", {
  maxZoom: 20,
  attribution: "Vue satellite &copy; <a href=\"http://www.google.com\">Google</a>"
});

var overlayBAN = L.tileLayer(
  "http://{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "Surcouche: &copy; BAN(O)"
  });

/*eslint-disable no-unused-vars */
var baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  "OpenStreetMap": layerOSM,
  "Carte IGN": layerIGN,
  "Plan IGN": layerIGNlite,
  //"Tranport": layerThunderforest,
  "Bing": layerBing,
  "Bing+OSM": layerBoner,
  "Cadastre": layerCadastre,
  "Esri": layerEsriWorldImagery,
  //"MapBox - Digiglobe": layerMapboxDigiglobe,
  //"Google": layerGoogle,
  "Google Sat": layerGoogleHybrid
};
var overlayMaps = {
  "Cadastre": overlayCadastre,
  "BAN(O)": overlayBAN
    //"Mapquest": layerMapboxHybrid,
};
/*eslint-enable no-unused-vars */
