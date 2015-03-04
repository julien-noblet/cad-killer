/*global L,config*/

var baseMaps = {
  'OpenStreetMap France': L.tileLayer(
    'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://openstreetmap.fr/">OpenStreetMap France</a>'
    }),
  'OpenStreetMap': L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://openstreetmap.org/">OpenStreetMap</a>'
    }),
  'Carte IGN': L.tileLayer(
    'http://wxs.ign.fr/' + config.ign.key + '/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + config.ign.layer + '&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg', {
      maxZoom: 18,
      minZoom: 6,
      attribution: '&copy; <a href="http://www.ign.fr">IGN</a>'
    }),
  'Tranport': L.tileLayer(
    'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://thunderforest.com/">Thunderforest</a>'
    }),
  'Bing': L.tileLayer(
    'http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://bing.com/">Bing</a> via Stamen'
    }),
  'Bing+OSM': L.tileLayer(
    'http://tile.stamen.com/boner/{z}/{x}/{y}.jpg', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://bing.com/">Bing</a> via Stamen'
    }),
  'Cadastre': L.tileLayer(
    'http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png', {
      maxZoom: 22,
      minZoom: 16,
      attribution: '&copy; Cadastre'
    }),
  'Esri': L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
  'Google': new L.Google('ROADMAP', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.google.com">Google</a>'
  }),
  'Google Sat': new L.Google('HYBRID', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.google.com">Google</a>'
  }),

};

var overlayMaps = {
  'Cadastre': L.tileLayer(
    'http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png', {
      maxZoom: 22,
      minZoom: 16,
      attribution: '&copy; Cadastre'
    }),
};

var layers = L.control.layers(baseMaps, overlayMaps);
