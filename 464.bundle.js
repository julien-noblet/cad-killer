"use strict";
(self["webpackChunkcad_killer"] = self["webpackChunkcad_killer"] || []).push([[464],{

/***/ 387:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: function() { return /* binding */ REVERSE_URL; },
/* harmony export */   H$: function() { return /* binding */ API_URL; },
/* harmony export */   HA: function() { return /* binding */ ATTRIBUTIONS; },
/* harmony export */   Od: function() { return /* binding */ SHORT_CITY_NAMES; },
/* harmony export */   Q7: function() { return /* binding */ CENTER; },
/* harmony export */   lL: function() { return /* binding */ IGN_LAYER; }
/* harmony export */ });
/* unused harmony exports IGN_LAYER_LITE, IGN_ORTHO, OSM_CREDITENTIALS, NOTE_API */
/**
 * @format
 */

var CENTER = [46.495, 2.201];
var API_URL = "//api-adresse.data.gouv.fr/search/?";
var REVERSE_URL = "//api-adresse.data.gouv.fr/reverse/?";
var SHORT_CITY_NAMES = ["y", "ay", "bu", "by", "eu", "fa", "gy", "oo", "oz", "py", "ri", "ry", "sy", "ur", "us", "uz"];
var ATTRIBUTIONS = "&copy; <a href='http://www.openstreetmap.org/copyright'>Contributeurs de OpenStreetMap</a> | <a href='https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/'>Adresses BAN</a> sous licence ODbL";
var IGN_LAYER = "GEOGRAPHICALGRIDSYSTEMS.MAPS";
var IGN_LAYER_LITE = "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2";
var IGN_ORTHO = "ORTHOIMAGERY.ORTHOPHOTOS";
var OSM_CREDITENTIALS = "Q0FELUtJTExFUjpkdHl2dWRlbnQ=";
var NOTE_API = "//api.openstreetmap.org/api/0.6/notes";

/***/ }),

/***/ 464:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// EXTERNAL MODULE: ./node_modules/leaflet/dist/leaflet-src.js
var leaflet_src = __webpack_require__(481);
var leaflet_src_default = /*#__PURE__*/__webpack_require__.n(leaflet_src);
// EXTERNAL MODULE: ./src/js/config.js
var config = __webpack_require__(387);
;// ./src/js/layers.js
/**
 * @format
 */




// Layers
var layerOSMfr = leaflet_src_default().tileLayer("//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: 'Fond de plan &copy; <a href="https://openstreetmap.fr/">OpenStreetMap France</a>'
});
var layerOSM = leaflet_src_default().tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: 'Fond de plan &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a>'
});
var layerCadastre = leaflet_src_default().tileLayer("http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png", {
  maxZoom: 22,
  minZoom: 16,
  attribution: "&copy; Cadastre"
});
var overlayCadastre = leaflet_src_default().tileLayer("http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png", {
  maxZoom: 22,
  minZoom: 16,
  attribution: "&copy; Cadastre"
});
var layerEsriWorldImagery = leaflet_src_default().tileLayer("//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});
var layerEsriWorldStreetMap = leaflet_src_default().tileLayer("//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
  attribution: "Tiles &copy; Esri &mdash; " + "Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});
var layerIGN = leaflet_src_default().tileLayer("//data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=".concat(config/* IGN_LAYER */.lL, "&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"), {
  maxZoom: 18,
  minZoom: 6,
  attribution: "IGN-F/Géoportail",
  tileSize: 256 // les tuiles du Géooportail font 256x256px
});
var overlayBAN = leaflet_src_default().tileLayer("//{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: "Surcouche: &copy; BAN(O)"
});
var baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  OpenStreetMap: layerOSM,
  // "Carte IGN": layerIGN, // je n'arrive pas a renouveller la clé IGN pour le moment
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery,
  "World Street Map": layerEsriWorldStreetMap
};
var overlayMaps = {
  Cadastre: overlayCadastre,
  "BAN(O)": overlayBAN
};
;// ./src/js/photon.js
/**
 * @format
 */



//import { sendClick, sendSearch } from "./stats";

__webpack_require__(143);
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var searchPoints = leaflet_src_default().geoJson(null, {
  onEachFeature: function onEachFeature(feature, layer) {
    layer.on("click", function () {
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
      window.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], zoom);
      // sendClick(feature); // Stats are not working
    });
    var popupContent = leaflet_src_default().DomUtil.create("div");
    popupContent.textContent = feature.properties.name;
    var link = leaflet_src_default().DomUtil.create("a", "geo", popupContent);
    link.href = "geo:".concat(feature.geometry.coordinates[1], ",").concat(feature.geometry.coordinates[0]);
    link.innerHTML = "<i class='zmdi-navigation zmdi-2x'></i>";
    layer.bindPopup(popupContent);
  }
});
function showSearchPoints(geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
}
function formatResult(feature, el) {
  var details = [];
  var detailsContainer = leaflet_src_default().DomUtil.create("small", "", el);
  var title = leaflet_src_default().DomUtil.create("strong", "", el);
  var types = {
    housenumber: "numéro",
    street: "rue",
    locality: "lieu-dit",
    hamlet: "hamlet",
    // TODO: Hameau?
    village: "village",
    city: "ville",
    commune: "commune"
  };
  title.textContent = feature.properties.name;
  if (types[feature.properties.type]) {
    leaflet_src_default().DomUtil.create("span", "type", title).textContent = types[feature.properties.type];
  }
  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) {
    details.push(feature.properties.context);
  }
  detailsContainer.textContent = details.join(", ");
}
var photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: config/* API_URL */.H$,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "julien.noblet+cad-killer@gmail.com",
  minChar: function minChar(val) {
    return config/* SHORT_CITY_NAMES */.Od.indexOf(val) !== -1 || val.length >= 3;
  },
  submitDelay: 200
};

/*
// not need
const photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: "topleft",
  url: REVERSE_URL,
  formatResult,
  noResultLabel: "Aucun résultat",
  tooltipLabel: "Cliquer sur la carte pour obtenir l'adresse"
};
*/

var myPhoton = new (leaflet_src_default()).Control.Photon(photonControlOptions);
function photon() {
  searchPoints.addTo(window.map);
  window.map.addControl(myPhoton);
  myPhoton.search.__proto__.setChoice = function setChoice(choice) {
    var c = choice || this.RESULTS[this.CURRENT];
    if (c) {
      // sendSearch(c.feature); // Stats are not working
      this.hide();
      this.input.value = "";
      this.fire("selected", {
        choice: c.feature
      });
      this.onSelected(c.feature);
    }
  };
}
;// ./src/js/map.js
/**
 * @format
 */




//import { dbinfo } from "./stats"; // Stats are not working :'(

__webpack_require__(277);
__webpack_require__(966);
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

// connection à la BD:
// dbinfo(); // Stats are not working :'(

// Initialisation de leaflet
window.map = leaflet_src_default().map("map", {
  attributionControl: false
});
var map_layers = leaflet_src_default().control.layers(baseMaps, overlayMaps);
(leaflet_src_default()).Icon.Default.imagePath = "./images/";
window.map.addLayer(layerOSMfr);
map_layers.addTo(window.map);
window.map.setView(config/* CENTER */.Q7, 6);
window.map.dragging.enable();
leaflet_src_default().control.attribution({
  position: "bottomleft",
  prefix: config/* ATTRIBUTIONS */.HA
}).addTo(window.map);

// ajout hash dans l'URL
// let hash;
new (leaflet_src_default()).Hash(window.map);

// Chargement des modules:
// require('./photon');
photon();
__webpack_require__.e(/* require.ensure */ 877).then((function () {
  __webpack_require__(877);
}).bind(null, __webpack_require__))['catch'](__webpack_require__.oe);

//require ("./geoloc.js")

// ajout du bouton print
/*L.control
  .browserPrint({
    printModes: [
      //L.control.browserPrint.mode.portrait("Portrait", "A4"),
      //L.control.browserPrint.mode.landscape("Paysage", "A4"),
      L.control.browserPrint.mode.auto("Auto", "A4"),
      L.control.browserPrint.mode.custom("Séléctionnez la zone", "A4"),
    ],
  })
  .addTo(window.map);
*/

/***/ })

}]);
//# sourceMappingURL=464.bundle.js.map