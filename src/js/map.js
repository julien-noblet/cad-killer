/*global L,
  API_URL,
  ATTRIBUTIONS,
  CENTER,
  overlayMaps,
  baseMaps,
  SHORT_CITY_NAMES,
  REVERSE_URL,
  layerOSMfr
   */
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var searchPointsFeature = function() {
  "use strict";
}; // JSLint hack. redefined after map()

var searchPoints = L.geoJson(null, {
  onEachFeature: searchPointsFeature()
});

var showSearchPoints = function(geojson) {
  "use strict";
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
};

var formatResult = function(feature, el) {
  "use strict";
  var title = L.DomUtil.create("strong", "", el),
    detailsContainer = L.DomUtil.create("small", "", el),
    details = [];
  var types = {
    housenumber: "numéro",
    street: "rue",
    locality: "lieu-dit",
    hamlet: "hamlet",
    village: "village",
    city: "ville",
    commune: "commune"
  };
  title.innerHTML = feature.properties.name;
  if (types[feature.properties.type]) {
    L.DomUtil.create("span", "type", title).innerHTML = types[feature.properties.type];
  }
  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) {
    details.push(feature.properties.context);
  }
  detailsContainer.innerHTML = details.join(", ");
};

var photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: API_URL,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "adresses@data.gouv.fr",
  minChar: function(val) {
    "use strict";
    return SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length >= 3;
  },
  submitDelay: 200
};

var photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: "topleft",
  url: REVERSE_URL,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  tooltipLabel: "Cliquer sur la carte pour obtenir l\'adresse"
};


var map = L.map("map", {
  photonControl: true,
  photonControlOptions: photonControlOptions,
  photonReverseControl: true,
  photonReverseControlOptions: photonReverseControlOptions,
  attributionControl: false
});

var layers = L.control.layers(baseMaps, overlayMaps);

// ajout hash dans l'URL
/*eslint-disable no-unused-vars */
var hash = new L.Hash(map);
/*eslint-enable no-unused-vars */

searchPointsFeature = function(feature, layer) {
  "use strict";
  layer.on("click", function() {
    map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 16);
  });
  layer.bindPopup(feature.properties.name + "<a class=\"geo\" href=\"geo:" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "\"><i class=\"zmdi-navigation zmdi-2x\"></i></a>");
};

L.Icon.Default.imagePath = "./images";
map.addLayer(layerOSMfr);

layers.addTo(map);

map.setView(CENTER, 6);
searchPoints.addTo(map);

L.control.attribution({
  position: "bottomleft",
  prefix: ATTRIBUTIONS
}).addTo(map);
L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: "topright" //"bottomright"
  },

  onAdd: function() {
    "use strict";
    var container = L.DomUtil.create("div", "reverse-label");
    var reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: function(data) {
        container.innerHTML = "Carte centrée sur «" + data.features[0].properties.label + "»";
      }
    });

    map.on("moveend", function() {
      if (this.getZoom() > 14) {
        reverse.doReverse(this.getCenter());
        document.getElementById("head").className += " headmasked";
        document.getElementById("map").className += " nohead";
      } else {
        container.innerHTML = "";
      }
    });
    return container;
  }

});

new L.Control.ReverseLabel().addTo(map);


// edition
/*
var edit = function () {
  var center = map.getCenter();
  var url = "http://www.openstreetmap.org/edit#map=" + map.getZoom() + "/" + center.lat + "/" + center.lng;
  // console.log("going to " + url);
  window.open(url, "_blank");
};
*/
