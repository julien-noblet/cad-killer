/* global L,
          map,
          sendNote,
          OSM_CREDITENTIALS,
          REVERSE_URL,
          NOTE_API
 */
"use strict";

/* eslint-disable no-unused-vars */
var isoControl = new L.Control.Draw({
  edit: false,
  draw: {
    polyline: false,
    polygon: false,
    rectangle: false,
    circle: false
  }
});
/* eslint-enable no-unused-vars */

var isoItems = new L.FeatureGroup();
var reachLayer;

function getReach(lat, lng) {
  var buckets = 5;
  var timeLimitInSeconds = 20 * 60;
  var vehicle = "small_truck";
  var url = "http://graphhopper.com/api/1/isochrone?"
            + "q=" + lat + "," + lng
            + "&time_limit=" + timeLimitInSeconds
            + "&vehicle=" + vehicle
            + "&buckets=" + buckets
            + "&key=" + "230ff812-b98a-4806-8cc7-4a27a2acd3a1";

  return $.ajax({
    url: url,
    type: "GET",
    dataType: "jsonp",
    timeout: 5000
  }).fail(function(err) {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
  }).pipe(function(json) {
    if (reachLayer) {
      reachLayer.clearLayers();
    }
    reachLayer = L.geoJson(json.polygons, {
      style: function(feature) {
        var num = feature.properties.bucket;
        var color = num % 2 === 0 ? "#00cc33" : "blue";
        return { color: color, weight: num + 2, opacity: 0.6 };
      }
    });
    map.addLayer(reachLayer);
  });
}
map.on("draw:created", function(e) {
  var layer = e.layer;
  getReach(layer._latlng);
});

map.addControl(isoControl);
