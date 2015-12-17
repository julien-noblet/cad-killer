/* global L,
          API_URL,
          SHORT_CITY_NAMES,
          REVERSE_URL,
          map,
          sendClick
*/
"use strict";

/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n"existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var searchPoints = L.geoJson(null, {
  onEachFeature: function(feature, layer) {
    layer.on("click", function() {
      var zoom = 16;
      switch (feature.properties.type) {
        case "housenumber":
          zoom = 18;
          break;
        case "street":
          zoom = 16;
          break;
        case "village":
          zoom = 12;
          break;
        case "city":
          zoom = 12;
          break;
        case "locality":
          zoom = 16;
          break;
        case "hamlet":
          zoom = 16;
          break;
        case "commune":
          zoom = 12;
          break;
        default:
          zoom = 16;
      }
      map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], zoom);
      sendClick(feature);
    });
    layer.bindPopup(feature.properties.name + "<a class=\"geo\" href=\"geo:" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "\"><i class=\"zmdi-navigation zmdi-2x\"></i></a>");
  }
});

var showSearchPoints = function(geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
};

var formatResult = function(feature, el) {
  var details = [],
    detailsContainer = L.DomUtil.create("small", "", el),
    title = L.DomUtil.create("strong", "", el);
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

/* eslint-disable no-unused-vars */
var photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: API_URL,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "julien.noblet+cad-killer@gmail.com",
  minChar: function(val) {
    return SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length >= 3;
  },
  submitDelay: 200
};
/* eslint-enable no-unused-vars */


/* eslint-disable no-unused-vars */
var photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: "topleft",
  url: REVERSE_URL,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  tooltipLabel: "Cliquer sur la carte pour obtenir l\'adresse"
};
/* eslint-enable no-unused-vars */

var myPhoton = new L.Control.Photon(photonControlOptions);

searchPoints.addTo(map);

map.addControl(myPhoton);

/* eslint-disable no-proto */
myPhoton.search.__proto__.setChoice = function(choice) {
  choice = choice || this.RESULTS[this.CURRENT];
  if (choice) {
    sendSearch(choice.feature);
    this.hide();
    this.input.value = "";
    this.fire("selected", {
      choice: choice.feature
    });
    this.onSelected(choice.feature);
  }
};
/* eslint-enable no-proto*/
