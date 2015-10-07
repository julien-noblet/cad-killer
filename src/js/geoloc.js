/* global L, map */
"use strict";

// Géoloc
var showPosition = function(position) {
  var icone = document.getElementById("geoloc_icon");
  map.setView([position.coords.latitude, position.coords.longitude], 16);
  icone.className = "zmdi zmdi-2x zmdi-gps-dot";
};

/* eslint-disable no-unused-vars */
var getLocation = function() {
  var icone = document.getElementById("geoloc_icon");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    icone.className = "zmdi zmdi-2x zmdi-gps";
  }
};
/* eslint-enable no-unused-vars */

var GeoLoc = L.Control.extend({
  options: {
    position: "topright"
  },
  onAdd: function() {
    // create the control container with a particular class name
    var container = L.DomUtil.create("div", "leaflet-control-geoloc");
    container.innerHTML = "<span onClick=\"getLocation();\" id=\"geoloc\" class=\"geoloc\"><i class=\"zmdi zmdi-2x zmdi-gps-off\" id=\"geoloc_icon\"></i></span>";
    // ... initialize other DOM elements, add listeners, etc.
    return container;
  }
});

map.addControl(new GeoLoc());
