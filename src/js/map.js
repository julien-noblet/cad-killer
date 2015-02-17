/*global L */
var CENTER = [46.495, 2.201];
var API_URL = 'http://api.adresse.data.gouv.fr/search/?';
var REVERSE_URL = 'http://api.adresse.data.gouv.fr/reverse/?';
var searchPoints = L.geoJson(null, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.name);
  }
});
var showSearchPoints = function(geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
};

var formatResult = function(feature, el) {
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
  feedbackEmail: 'adresses@data.gouv.fr'
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
    attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a> | Tiles \u00a9 <a href="http://openstreetmap.fr/">OpenStreetMap France</a>'
  });
var osm = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a> | Tiles \u00a9 <a href="http://openstreetmap.org/">OpenStreetMap</a>'
  });
var thunderforest = L.tileLayer(
  'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a> | Tiles \u00a9 <a href="http://thunderforest.com/">Thunderforest</a>'
  });
var bing = L.tileLayer(
  'http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a> | Tiles \u00a9 <a href="http://bing.com/">Bing</a>'
  });
var boner = L.tileLayer(
  'http://tile.stamen.com/boner/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a> | Tiles \u00a9 <a href="http://bing.com/">Bing</a>'
  });

var map = L.map('map', {
  photonControl: true,
  photonControlOptions: photonControlOptions,
  photonReverseControl: true,
  photonReverseControlOptions: photonReverseControlOptions,
  attributionControl: false,
});
L.Icon.Default.imagePath = '/cad-killer/images/leaflet/dist/images';
map.addLayer(osmfr);
var baseMaps = {
  'OpenStreetMap France': osmfr,
  'OpenStreetMap': osm,
  'Tranport': thunderforest,
  'Bing': bing,
  'Bing+OSM': boner,
  //"Google" : google,
  //"Google Sat" : googlesat,

};
var overlayMaps = {

};
L.control.layers(baseMaps).addTo(map);

map.setView(CENTER, 6);
searchPoints.addTo(map);

L.control.attribution({
  position: 'bottomleft'
}).addTo(map);
var label = document.getElementById('label');
L.Control.ReverseLabel = L.Control.extend({

  options: {
    position: 'topright' //'bottomright'
  },

  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'reverse-label');
    var reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: function(data) {
        container.innerHTML = 'Carte centrée sur «' + data.features[0].properties.label + '»';
      }
    });

    map.on('moveend', function() {
      if (this.getZoom() > 14) reverse.doReverse(this.getCenter());
      else container.innerHTML = '';
    });
    return container;
  }

});
new L.Control.ReverseLabel().addTo(map);
var hash = new L.Hash(map);

// edition
var edit = function() {
  var center = map.getCenter();
  var url = 'http://www.openstreetmap.org/edit#map=' + map.getZoom() + '/' + center.lat + '/' + center.lng;
  // console.log('going to ' + url);
  window.open(url, '_blank');
};
