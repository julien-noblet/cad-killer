/* eslint-disable max-len*/
import L from 'leaflet';
import { IGN_KEY, IGN_LAYER, IGN_LAYER_LITE } from './config';

require('leaflet.gridlayer.googlemutant');

// Layers
export const layerOSMfr = L.tileLayer(
  'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: 'Fond de plan &copy; <a href="http://openstreetmap.fr/">OpenStreetMap France</a>',
  });

export const layerOSM = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Fond de plan &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a>',
  });

export const layerMapsurfer = L.tileLayer(
  'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Fond de plan &copy; <a gref="http://openmapsurfer.uni-hd.de/">OpenMapSurfer</a>',
  });

const overlayMapsurfer = L.tileLayer(
  'http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Surcouche &copy <a gref="http://openmapsurfer.uni-hd.de/">OpenMapSurfer</a>',
  });

export const layerBing = L.tileLayer(
  'http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'Vue satellite &copy; <a href="http://bing.com/">Bing</a> via Stamen',
  });

export const layerBoner = L.tileLayer(
  'http://tile.stamen.com/boner/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'Vue satellite &copy; <a href="http://bing.com/">Bing</a> via Stamen',
  });

export const layerCadastre = L.tileLayer(
  'http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png', {
    maxZoom: 22,
    minZoom: 16,
    attribution: '&copy; Cadastre',
  });

export const overlayCadastre = L.tileLayer(
  'http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png', {
    maxZoom: 22,
    minZoom: 16,
    attribution: '&copy; Cadastre',
  });

export const layerEsriWorldImagery = L.tileLayer(
  'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  });

export const layerIGN = L.tileLayer(
  `http://wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`, {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'Fond de plan &copy; <a href="http://www.ign.fr">IGN</a>',
  });

export const layerIGNlite = L.tileLayer(
  `http://wxs.ign.fr/${IGN_KEY}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${IGN_LAYER_LITE}&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg`, {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'Fond de plan &copy; <a href="http://www.ign.fr">IGN</a>',
  });

/* eslint-disable new-cap*/
export const layerGoogleHybrid = new L.gridLayer.googleMutant({
  type: 'hybrid',
  maxZoom: 20,
  attribution: 'Vue satellite &copy; <a href="http://www.google.com">Google</a>',
});
/* eslint-enable new-cap*/


export const overlayBAN = L.tileLayer(
  'http://{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: 'Surcouche: &copy; BAN(O)',
  });

export const baseMaps = {
  'OpenStreetMap France': layerOSMfr,
  OpenStreetMap: layerOSM,
  'Carte IGN': layerIGN,
  'Plan IGN': layerIGNlite,
  MapSurfer: layerMapsurfer,
  Bing: layerBing,
  'Bing+OSM': layerBoner,
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery,
  'Google Sat': layerGoogleHybrid,
};

export const overlayMaps = {
  Cadastre: overlayCadastre,
  'BAN(O)': overlayBAN,
  MapSurfer: overlayMapsurfer,
};
/* eslint-enable max-len */
