"use strict";
(self["webpackChunkcad_killer"] = self["webpackChunkcad_killer"] || []).push([[963],{

/***/ 314:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dv": function() { return /* binding */ CENTER; },
/* harmony export */   "T5": function() { return /* binding */ API_URL; },
/* harmony export */   "o7": function() { return /* binding */ REVERSE_URL; },
/* harmony export */   "jq": function() { return /* binding */ SHORT_CITY_NAMES; },
/* harmony export */   "NR": function() { return /* binding */ ATTRIBUTIONS; },
/* harmony export */   "n2": function() { return /* binding */ IGN_KEY; },
/* harmony export */   "GI": function() { return /* binding */ IGN_LAYER; },
/* harmony export */   "cU": function() { return /* binding */ IGN_LAYER_LITE; },
/* harmony export */   "ab": function() { return /* binding */ IGN_ORTHO; }
/* harmony export */ });
/* unused harmony exports MY_POUCHDB, LOCAL_POUCHDB, OSM_CREDITENTIALS, NOTE_API */
/**
 * 
 *
 * @format
 */
var CENTER = [46.495, 2.201];
var API_URL = "//api-adresse.data.gouv.fr/search/?";
var REVERSE_URL = "//api-adresse.data.gouv.fr/reverse/?";
var SHORT_CITY_NAMES = ["y", "ay", "bu", "by", "eu", "fa", "gy", "oo", "oz", "py", "ri", "ry", "sy", "ur", "us", "uz"];
var ATTRIBUTIONS = "&copy; <a href='http://www.openstreetmap.org/copyright'>Contributeurs de OpenStreetMap</a> | <a href='https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/'>Adresses BAN</a> sous licence ODbL";
var IGN_KEY = "3sk4po838nk0byb23gft0qs5";
var IGN_LAYER = "GEOGRAPHICALGRIDSYSTEMS.MAPS";
var IGN_LAYER_LITE = "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2";
var IGN_ORTHO = "ORTHOIMAGERY.ORTHOPHOTOS";
var MY_POUCHDB = "//sidercomourellydiforteep:16f21a8ad23f32de280b36fc338a38a24c5d49b2@couchdb-112956.smileupps.com/stats";
var LOCAL_POUCHDB = "cad-killer";
var OSM_CREDITENTIALS = "Q0FELUtJTExFUjpkdHl2dWRlbnQ=";
var NOTE_API = "//api.openstreetmap.org/api/0.6/notes";

/***/ }),

/***/ 963:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/leaflet/dist/leaflet-src.js
var leaflet_src = __webpack_require__(243);
var leaflet_src_default = /*#__PURE__*/__webpack_require__.n(leaflet_src);
// EXTERNAL MODULE: ./src/js/config.js
var config = __webpack_require__(314);
;// CONCATENATED MODULE: ./src/js/layers.js
/**
 * 
 *
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
var layerBing = leaflet_src_default().tileLayer("http://tile.stamen.com/bing-lite/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  attribution: 'Vue satellite &copy; <a href="https://bing.com/">Bing</a> via Stamen'
});
var layerBoner = leaflet_src_default().tileLayer("http://tile.stamen.com/boner/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  attribution: 'Vue satellite &copy; <a href="https://bing.com/">Bing</a> via Stamen'
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
var layerIGN = leaflet_src_default().tileLayer("//wxs.ign.fr/".concat(config/* IGN_KEY */.n2, "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=").concat(config/* IGN_LAYER */.GI, "&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg"), {
  maxZoom: 18,
  minZoom: 6,
  attribution: 'IGN-F/Géoportail'
});
var layerIGNlite = leaflet_src_default().tileLayer("//wxs.ign.fr/".concat(config/* IGN_KEY */.n2, "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=").concat(config/* IGN_LAYER_LITE */.cU, "&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg"), {
  maxZoom: 18,
  minZoom: 6,
  attribution: 'IGN-F/Géoportail'
});
var layerIGNortho = leaflet_src_default().tileLayer("//wxs.ign.fr/".concat(config/* IGN_KEY */.n2, "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=").concat(config/* IGN_ORTHO */.ab, "&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg"), {
  maxZoom: 18,
  minZoom: 0,
  attribution: 'IGN-F/Géoportail'
});
var overlayBAN = leaflet_src_default().tileLayer("//{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: "Surcouche: &copy; BAN(O)"
});
var baseMaps = {
  "OpenStreetMap France": layerOSMfr,
  OpenStreetMap: layerOSM,
  "Carte IGN": layerIGN,
  "Plan IGN": layerIGNlite,
  "Orthophoto IGN": layerIGNortho,
  Bing: layerBing,
  "Bing+OSM": layerBoner,
  Cadastre: layerCadastre,
  Esri: layerEsriWorldImagery
};
var overlayMaps = {
  Cadastre: overlayCadastre,
  "BAN(O)": overlayBAN
};
;// CONCATENATED MODULE: ./src/js/photon.js
/**
 * 
 *
 * @format
 */

 //import { sendClick, sendSearch } from "./stats";

__webpack_require__(430);
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

      window.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], zoom); // sendClick(feature); // Stats are not working
    });
    layer.bindPopup("".concat(feature.properties.name, "<a class='geo' href='geo:").concat(feature.geometry.coordinates[1], ",").concat(feature.geometry.coordinates[0], "'><i class='zmdi-navigation zmdi-2x'></i></a>"));
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
  title.innerHTML = feature.properties.name;

  if (types[feature.properties.type]) {
    leaflet_src_default().DomUtil.create("span", "type", title).innerHTML = types[feature.properties.type];
  }

  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }

  if (feature.properties.context) {
    details.push(feature.properties.context);
  }

  detailsContainer.innerHTML = details.join(", ");
}

var photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: config/* API_URL */.T5,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "julien.noblet+cad-killer@gmail.com",
  minChar: function minChar(val) {
    return config/* SHORT_CITY_NAMES.indexOf */.jq.indexOf(val) !== -1 || val.length >= 3;
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
  /* eslint-disable no-proto */

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
  /* eslint-enable no-proto*/

}
;// CONCATENATED MODULE: ./src/js/map.js
/**
 * 
 *
 * @format
 */


 //import { dbinfo } from "./stats"; // Stats are not working :'(



__webpack_require__(92);

__webpack_require__(885);
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
window.map.setView(config/* CENTER */.dv, 6);
window.map.dragging.enable();
leaflet_src_default().control.attribution({
  position: "bottomleft",
  prefix: config/* ATTRIBUTIONS */.NR
}).addTo(window.map); // ajout hash dans l'URL

var hash;
hash = new (leaflet_src_default()).Hash(window.map); // Chargement des modules:
// require('./photon');

photon();

__webpack_require__.e(/* require.ensure */ 971).then((function () {
  __webpack_require__(971);
}).bind(null, __webpack_require__))['catch'](__webpack_require__.oe);
/*
// Removing notes because seems not working!
// The loading of L.Draw cause also some fails with Jest!
require.ensure(["./notes"], function() {
  require("./notes");
});
*/
//require ("./geoloc.js")
// ajout du bouton print


leaflet_src_default().control.browserPrint({
  printModes: [leaflet_src_default().control.browserPrint.mode.portrait("Portrait", "A4"), leaflet_src_default().control.browserPrint.mode.landscape("Paysage", "A4"), leaflet_src_default().control.browserPrint.mode.auto("Auto", "A4"), leaflet_src_default().control.browserPrint.mode.custom("Séléctionnez la zone", "A4")]
}).addTo(window.map);

/***/ })

}]);
//# sourceMappingURL=963.bundle.js.map