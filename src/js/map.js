/*global L */
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var CENTER = [46.495, 2.201];
var API_URL = 'http://api-adresse.data.gouv.fr/search/?';
var REVERSE_URL = 'http://api-adresse.data.gouv.fr/reverse/?';
var SHORT_CITY_NAMES = ['y', 'ay', 'bu', 'by', 'eu', 'fa', 'gy', 'oo', 'oz', 'py', 'ri', 'ry', 'sy', 'ur', 'us', 'uz'];
var ATTRIBUTIONS = '&copy; <a href="http://www.openstreetmap.org/copyright">Contributeurs de OpenStreetMap</a> | <a href="https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/">Adresses BANO</a> sous licence ODbL';
var IGN_KEY = 'ztr0a9dk574qlszvikoa0zqi'; //'2ya53yhtpe1sd5egoc1tebhi';
var IGN_LAYER = 'GEOGRAPHICALGRIDSYSTEMS.MAPS'; // GEOGRAPHICALGRIDSYSTEMS.PLANIGN
var IGN_LAYER_LITE = 'GEOGRAPHICALGRIDSYSTEMS.PLANIGN'; // GEOGRAPHICALGRIDSYSTEMS.PLANIGN

var searchPoints = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    layer.on('click', function (e) {
      map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 16);
    });
    layer.bindPopup(feature.properties.name + '<a class="geo" href="geo:' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '"><i class="md-navigation md-2x"></i></a>');
  }
});

var showSearchPoints = function (geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
};

var formatResult = function (feature, el) {
  var title = L.DomUtil.create('strong', '', el),
    detailsContainer = L.DomUtil.create('small', '', el),
    details = [],
    type = this.formatType(feature);
  title.innerHTML = feature.properties.name;
  var types = {
    housenumber: 'numéro',
    street: 'rue',
    locality: 'lieu-dit',
    hamlet: 'hamlet',
    village: 'village',
    city: 'ville',
    commune: 'commune',
  };
  if (types[feature.properties.type]) L.DomUtil.create('span', 'type', title).innerHTML = types[feature.properties.type];
  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) details.push(feature.properties.context);
  detailsContainer.innerHTML = details.join(', ');
};

var photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: 'Ex. 6 quai de la tourelle cergy…',
  position: 'topright',
  url: API_URL,
  formatResult: formatResult,
  noResultLabel: 'Aucun résultat',
  feedbackLabel: 'Signaler',
  feedbackEmail: 'adresses@data.gouv.fr',
  minChar: function (val) {
    return SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length >= 3;
  },
  submitDelay: 200
};

var photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: 'topleft',
  url: REVERSE_URL,
  formatResult: formatResult,
  noResultLabel: 'Aucun résultat',
  tooltipLabel: 'Cliquer sur la carte pour obtenir l\'adresse'
};

// Layers
var osmfr = L.tileLayer(
  'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: 'Fond de plan &copy; <a href="http://openstreetmap.fr/">OpenStreetMap France</a>'
  });
var osm = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Fond de plan &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a>'
  });
var thunderforest = L.tileLayer(
  'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Fond de plan &copy; Tiles Courtesy of <a href="http://thunderforest.com/">Andy Allan</a>'
  });
var bing = L.tileLayer(
  'http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'Vue satellite &copy; <a href="http://bing.com/">Bing</a> via Stamen'
  });
var boner = L.tileLayer(
  'http://tile.stamen.com/boner/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'Vue satellite &copy; <a href="http://bing.com/">Bing</a> via Stamen'
  });
var cadastre = L.tileLayer(
  'http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png', {
    maxZoom: 22,
    minZoom: 16,
    attribution: '&copy; Cadastre'
  });
var cadastre_t = L.tileLayer(
  'http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png', {
    maxZoom: 22,
    minZoom: 16,
    attribution: '&copy; Cadastre'
  });
var Esri_WorldImagery = L.tileLayer(
  'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
var mapbox_digiglobe = L.tileLayer(
  'http://{s}.tiles.mapbox.com/v3/openstreetmap.map-4wvf9l0l/{z}/{x}/{y}.png', {
    attribution: '&copy; Mapbox'
  });
var mapquest_hyb = L.tileLayer(
  'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{y}/{x}.png', {
    subdomains: '1234',
    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
  });
/*var ign = new L.TileLayer.WMTS( 'http://wxs.ign.fr/' + IGN_KEY + '/geoportail/wmts', {
  layer: IGN_LAYER,
  style: 'normal',
  tilematrixSet: 'PM',
  format: 'image/jpeg',
  attribution: '&copy; <a href="http://www.ign.fr">IGN</a>'
});
*/
var ign = L.tileLayer(
  'http://wxs.ign.fr/' + IGN_KEY + '/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + IGN_LAYER + '&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg', {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'Fond de plan &copy; <a href="http://www.ign.fr">IGN</a>'
  });
var ign_lite = L.tileLayer(
  'http://wxs.ign.fr/' + IGN_KEY + '/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + IGN_LAYER_LITE + '&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg', {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'Fond de plan &copy; <a href="http://www.ign.fr">IGN</a>'
  });
/*
var ggl = new L.Google('ROADMAP', {
  maxZoom: 20,
  attribution: 'Fond de plan &copy; <a href="http://www.google.com">Google</a>'
});
*/
var ggl_hyb = new L.Google('HYBRID', {
  maxZoom: 20,
  attribution: 'Vue satellite &copy; <a href="http://www.google.com">Google</a>'
});
var ban = L.tileLayer(
    'http://{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png',{
        maxZoom: 20,
        attribution: 'Surcouche: &copy; BAN(O)'
    });

var map = L.map('map', {
  photonControl: true,
  photonControlOptions: photonControlOptions,
  photonReverseControl: true,
  photonReverseControlOptions: photonReverseControlOptions,
  attributionControl: false,
});
L.Icon.Default.imagePath = './images';
map.addLayer(osmfr);
var baseMaps = {
  'OpenStreetMap France': osmfr,
  'OpenStreetMap': osm,
  'Carte IGN': ign,
  'Plan IGN': ign_lite,
  //'Tranport': thunderforest,
  'Bing': bing,
  'Bing+OSM': boner,
  'Cadastre': cadastre,
  'Esri': Esri_WorldImagery,
  //'MapBox - Digiglobe': mapbox_digiglobe,
  //'Google': ggl,
  'Google Sat': ggl_hyb,
};
var overlayMaps = {
  'Cadastre': cadastre_t,
  'BAN(O)': ban,
  //'Mapquest': mapquest_hyb,
};

var layers = L.control.layers(baseMaps, overlayMaps);
layers.addTo(map);

map.setView(CENTER, 6);
searchPoints.addTo(map);

L.control.attribution({
  position: 'bottomleft',
  prefix: ATTRIBUTIONS
}).addTo(map);
var label = document.getElementById('label');
L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: 'topright' //'bottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'reverse-label');
    var reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: function (data) {
        container.innerHTML = 'Carte centrée sur «' + data.features[0].properties.label + '»';
      }
    });

    map.on('moveend', function () {
      if (this.getZoom() > 14) {
        reverse.doReverse(this.getCenter());
        document.getElementById('head').className += ' headmasked';
        document.getElementById('map').className += ' nohead';
      } else container.innerHTML = '';
    });
    return container;
  }

});

new L.Control.ReverseLabel().addTo(map);

/*map.addControl(new L.Control.Permalink({
  text: 'Permalink',
  layers: layers,
  useLocation: true
}));
*/

// ajout hash dans l'URL
var hash = new L.Hash(map);

// edition
var edit = function () {
  var center = map.getCenter();
  var url = 'http://www.openstreetmap.org/edit#map=' + map.getZoom() + '/' + center.lat + '/' + center.lng;
  // console.log('going to ' + url);
  window.open(url, '_blank');
};

// Géoloc
var showPosition = function (position) {
  map.setView([position.coords.latitude, position.coords.longitude], 16);
  var icone = document.getElementById('geoloc_icon');
  icone.className = 'md-gps-fixed';

};

var getLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    var icone = document.getElementById('geoloc_icon');
    icone.className = 'md-gps-not-fixed';

  }
};

var geoLoc = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    // create the control container with a particular class name
    var container = L.DomUtil.create('div', 'leaflet-control-geoloc');
    container.innerHTML = '<span onClick="getLocation();" id="geoloc" class="md-2x"><i class="md-gps-off" id="geoloc_icon"></i></span>';
    // ... initialize other DOM elements, add listeners, etc.

    return container;
  }
});

map.addControl(new geoLoc());
