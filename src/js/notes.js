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

var addNote = function() {
  "use strict";
  var lat = document.getElementById("lat").value;
  var lng = document.getElementById("lng").value;
  var note = document.getElementById("textnote").value;

  var path = "/api/0.6/notes";
  var API = "http://api.openstreetmap.org/" + path;
  var content = "?lat=" + lat + "&lon=" + lng + "&text=" + encodeURIComponent(note);
  var options = {
    "method": "POST",
    "headers": {
      "Authorization": "Basic " + "Q0FELUtJTExFUjpkdHl2dWRlbnQ="
    }
  };

  $.ajax({
    url: API + content,
    type: "post",
    headers: options.headers,
    success: function(data) {



      map.fire('modal', {
        content: '<h1>Votre Note à été envoyée <i class="zmdi zmdi-mood"></i></h1><br/>Merci pour votre contribution.'
      });
      ga("send", "event", "element", "note", "post:" + data, 0);
      /*eslint-disable no-console*/
      console.info(data);
      /*eslint-enable no-console*/
    }
  });
};
/*eslint-enable no-unused-vars*/

/*eslint-disable no-unused-vars*/
var resetNote = function() {
  "use strict";
  document.getElementById("noteholder").className = "noteholder hidden";
  document.getElementById("noteok").className = "noteok hidden";
  document.getElementById("newnote").className = "note";
  map.removeLayer(notesItems);
};
/*eslint-enable no-unused-vars*/


map.on("draw:created", function(e) {
  "use strict";
  var layer = e.layer;

  //console.log("test", myPhoton );
  /*eslint-disable no-underscore-dangle */
  var url = [REVERSE_URL, "lon=", layer._latlng.lng, "&lat=", layer._latlng.lat].join("");
  var req = $.ajax(url, {
    dataType: "json"
  });
  /*eslint-enable no-underscore-dangle */
  L.Util.ajax(url).then(function(data) {
    var city = "";

    if (data.features[0]) {
      city = ["<span class=\"city\">\n près de ", data.features[0].properties.city, "<span>"].join("");
    }
    notesItems.addLayer(layer);
    map.addLayer(notesItems);

    map.fire("modal", {
      content: ["<textarea id=\"textnote\" class=\"textnote\" name=\"textnote\" autofocus=\"yes\"></textarea>"].join(""), // HTML string
      title: ["Nouvelle demande de correction de la carte", city, " :"].join(""),
      template: ["<div class=\"modal-header\"><h2>{title}</h2></div>",
        "<hr>",
        "<div class=\"modal-body\">{content}</div>",
        "<div class=\"modal-footer\">",
        /*eslint-disable no-underscore-dangle */
        "<input type=\"hidden\" id=\"lat\" name=\"lat\" value=\"", layer._latlng.lat, "\">",
        "<input type=\"hidden\" id=\"lng\" name=\"lng\" value=\"", layer._latlng.lng, "\">",
        /*eslint-disable no-underscore-dangle */
        "<input type=\"submit\" class=\"topcoat-button--large\" value=\"{okText}\" ",
        "onclick=\" addNote() \">",
        /*eslint-enable no-underscore-dangle */
        "<input type=\"submit\" class=\"topcoat-button--large {CLOSE_CLS}\" value=\"{cancelText}\" onclick=\"map.closeModal();\">",
        "</div>"
      ].join(""),
      addNote: ["",
        "addNote( \"", layer._latlng.lat,
        "\", \"", layer._latlng.lng,
        "\", \"", (data.features[0]) ? data.features[0].properties.city : "",
        "\", \"",
        "textnote",
        "\" );"
      ].join(""),
      okText: "Soumettre la note",
      cancelText: "Annuler",
      closeTitle: "Fermer", // alt title of the close button
      zIndex: 10000, // needs to stay on top of the things
      transitionDuration: 300, // expected transition duration
      // callbacks for convenience,
      // you can set up you handlers here for the contents
      /*eslint-disable no-console */
      //onShow: function(evt){ var modal = evt.modal; console.log(modal); },
      onHide: function() {
        map.removeLayer(notesItems);
      },
      /*eslint-enable no-console */

      // change at your own risk
      OVERLAY_CLS: "overlay", // overlay(backdrop) CSS class
      MODAL_CLS: "modal", // all modal blocks wrapper CSS class
      MODAL_CONTENT_CLS: "modal-content", // modal window CSS class
      INNER_CONTENT_CLS: "modal-inner", // inner content wrapper
      SHOW_CLS: "show", // `modal open` CSS class, here go your transitions
      CLOSE_CLS: "close" // `x` button CSS class
    });

    /*eslint-disable no-console*/
    //console.log(data);
    //console.log(data.features[0].properties.city);

  });

});

//layers.addOverlay(notesItems, "Ma note");
// translates!
L.drawLocal.draw.toolbar.buttons.marker = "Signaler une erreur ou un oublis sur la carte.";
L.drawLocal.draw.toolbar.actions.title = "Annuler le signalement";
L.drawLocal.draw.toolbar.actions.text = "Annuler";
L.drawLocal.draw.handlers.marker.tooltip.start = "Placez l'emplacement de l'erreur sur la carte.";

map.addControl(notesControl);
