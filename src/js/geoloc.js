/* global L, map */

// Géoloc
function showPosition(position) {
  const icone = document.getElementById("geoloc_icon");
  map.setView([position.coords.latitude, position.coords.longitude], 16);
  icone.className = "zmdi zmdi-2x zmdi-gps-dot";
}

/* eslint-disable no-unused-vars */
function getLocation() {
  const icone = document.getElementById("geoloc_icon");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    icone.className = "zmdi zmdi-2x zmdi-gps";
  }
}
/* eslint-enable no-unused-vars */

const GeoLoc = L.Control.extend({
  options: {
    position: "topright"
  },
  onAdd: () => L.DomUtil.create("div", "leaflet-control-geoloc")
              .set("<span onClick=\"getLocation();\" id=\"geoloc\" class=\"geoloc\">"
              + "<i class=\"zmdi zmdi-2x zmdi-gps-off\" id=\"geoloc_icon\"></i></span>")
});

map.addControl(new GeoLoc());
