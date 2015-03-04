/*global L, config, layers */

var searchPoints = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    layer.on('click', function (e) {
        map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],16);
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
  url: config.api_url,
  formatResult: formatResult,
  noResultLabel: 'Aucun résultat',
  feedbackLabel: 'Signaler',
  feedbackEmail: 'adresses@data.gouv.fr',
  minChar: function (val) {
    return config.short_city_names.indexOf(val) !== -1 || val.length >= 3;
  },
  submitDelay: 200
};

var photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: 'topleft',
  url: config.reverse_url,
  formatResult: formatResult,
  noResultLabel: 'Aucun résultat',
  tooltipLabel: 'Cliquer sur la carte pour obtenir l\'adresse'
};

//TODO : redefine map

var map = L.map('map', {
  photonControl: true,
  photonControlOptions: photonControlOptions,
  photonReverseControl: true,
  photonReverseControlOptions: photonReverseControlOptions,
  attributionControl: false,
});
L.Icon.Default.imagePath = './images';

layers.addTo(map);

map.setView(config.center, 6);
searchPoints.addTo(map);

L.control.attribution({
  position: 'bottomleft',
  prefix: config.attributions
}).addTo(map);
var label = document.getElementById('label');
L.Control.ReverseLabel = L.Control.extend({

  options: {
    position: 'topright' //'bottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'reverse-label');
    var reverse = new L.PhotonReverse({
      url: config.reverse_url,
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

map.addControl(new L.Control.Permalink({
  text: 'Permalink',
  layers: layers,
  useLocation: true
}));



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
