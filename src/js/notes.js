/*global $,L,map,REVERSE_URL,ga
 */

/*eslint-disable no-unused-vars*/
var notesControl = new L.Control.Draw({
  edit: false,
  draw: {
    polyline: false,
    polygon: false,
    rectangle: false,
    circle: false
  }
});
/*eslint-enable no-unused-vars*/

var notesItems = new L.FeatureGroup();

/*eslint-disable no-unused-vars*/
var addNote = function() {
  "use strict";
  var lat = document.getElementById("lat").value;
  var lng = document.getElementById("lng").value;
  var note = document.getElementById("textnote").value;

  var path = "/api/0.6/notes";
  var API = "http://api06.dev.openstreetmap.org" + path;
  var content = "?lat=" + lat + "&lon=" + lng + "&text=" + encodeURIComponent(note);
  var postUrl = API + content;
  var options = {
    "method": "POST",
    "headers": {
      "Authorization": "Basic " + "Q0FELUtJTExFUjpkdHl2dWRlbnQ="
    }
  };

  document.getElementById("noteholder").className = "noteholder hidden";
  $.ajax({
    url: API + content,
    type: "post",
    headers: options.headers,
    success: function(data) {
      ga("send", "event", "element", "note", "post:" + data, 0);

      document.getElementById("newnote").className += "hidden";
      document.getElementById("noteok").className = "noteok";
      /*eslint-disable no-console*/
      console.info(data);
      /*eslint-enable no-console*/
    }
  });
};
/*eslint-enable no-unused-vars*/

/*eslint-disable no-unused-vars*/
var resetNote = function(){
  "use strict";
  document.getElementById("noteholder").className = "noteholder hidden";
  document.getElementById("noteok").className = "noteok hidden";
  document.getElementById("newnote").className = "note";
  map.removeLayer(notesItems);
};
/*eslint-enable no-unused-vars*/

map.addControl(notesControl);

map.on("draw:created", function(e) {
  "use strict";
  var layer = e.layer;

  //console.log("test", myPhoton );
  /*eslint-disable no-underscore-dangle */
  var req = $.ajax(REVERSE_URL + "lon=" + layer._latlng.lng + "&lat=" + layer._latlng.lat, {
    dataType: "json"
  });
  /*eslint-enable no-underscore-dangle */

  req.done(function(msg) {
    var city = msg.features[0].properties.city;
    /*eslint-disable no-underscore-dangle */
    document.getElementById("lat").value = layer._latlng.lat;
    document.getElementById("lng").value = layer._latlng.lng;
    /*eslint-enable no-underscore-dangle */
    document.getElementById("noteholder").className = "noteholder";
    document.getElementById("noteref").innerHTML = city;
    notesItems.addLayer(layer);
    map.addLayer(notesItems);
  });
  req.fail(function(msg) {
    /*eslint-disable no-console*/
    console.log(msg);
    /*eslint-enable no-console*/
  });
});

//layers.addOverlay(notesItems, "Ma note");
// translates!
L.drawLocal.draw.toolbar.buttons.marker = "Siganler une erreur ou un oublis sur la carte.";
L.drawLocal.draw.toolbar.actions.title = "Annuler le signalement";
L.drawLocal.draw.toolbar.actions.text = "Annuler";
L.drawLocal.draw.handlers.marker.tooltip.start = "Placez l'emplacement de l'erreur sur la carte.";
