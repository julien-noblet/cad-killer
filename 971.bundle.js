"use strict";
(self["webpackChunkcad_killer"] = self["webpackChunkcad_killer"] || []).push([[971],{

/***/ 971:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(243);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/**
 * 
 *
 * @format
 */


(leaflet__WEBPACK_IMPORTED_MODULE_0___default().Control.ReverseLabel) = leaflet__WEBPACK_IMPORTED_MODULE_0___default().Control.extend({
  options: {
    position: "topright" // hack

  },
  onAdd: function onAdd() {
    var container = leaflet__WEBPACK_IMPORTED_MODULE_0___default().DomUtil.create("div", "reverse-label");
    var reverse = new (leaflet__WEBPACK_IMPORTED_MODULE_0___default().PhotonReverse)({
      url: _config__WEBPACK_IMPORTED_MODULE_1__/* .REVERSE_URL */ .o7,
      handleResults: function handleResults(data) {
        if (data.features !== null) {
          if (data.features[0] !== null) {
            if (data.features[0].properties !== null) {
              container.innerHTML = "Carte centr\xE9e sur \xAB".concat(data.features[0].properties.label, "\xBB");
            }
          }
        }
      }
    });
    window.map.on("moveend", function () {
      if (window.map.getZoom() > 14) {
        reverse.doReverse(window.map.getCenter());
        var head = document.getElementById("head");
        var map = document.getElementById("map");

        if (head !== null) {
          head.className += " headmasked";
        }

        if (map !== null) {
          map.className += " nohead";
        }
      } else {
        container.innerHTML = "";
      }
    });
    return container;
  }
});
new (leaflet__WEBPACK_IMPORTED_MODULE_0___default().Control.ReverseLabel)().addTo(window.map);

/***/ })

}]);
//# sourceMappingURL=971.bundle.js.map