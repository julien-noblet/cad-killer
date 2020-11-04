/**
 * @flow
 *
 * @format
 */

import $ from "jquery";
import L from "leaflet";
import { REVERSE_URL, NOTE_API } from "./config";
//import { sendNote } from "./stats";

// require('font-awesome-webpack');
require.ensure(["leaflet-dialog"], function () {
  require("leaflet-dialog");
});
require("leaflet-dialog/Leaflet.Dialog.css");
require("leaflet-draw");
require.ensure(["leaflet-ajax"], function () {
  require("leaflet-ajax");
});

/* eslint-disable no-unused-vars */
const notesControl = new L.Control.Draw({
  edit: false,
  draw: {
    circle: false,
    circlemarker: false,
    polygon: false,
    polyline: false,
    rectangle: false,
  },
});
/* eslint-enable no-unused-vars */

const notesItems = new L.FeatureGroup();

/* eslint-disable no-unused-vars */
window.addNote = function addNote(): void {
  let eLat = document.getElementById("lat");
  let eLng = document.getElementById("lng");
  let eNote = document.getElementById("textnote");
  //console.log(eLat, eLng, eNote);
  if (
    eLat instanceof HTMLInputElement &&
    eLng instanceof HTMLInputElement &&
    eNote instanceof HTMLTextAreaElement &&
    isNaN(parseFloat(eLat.value)) &&
    isNaN(parseFloat(eLng.value)) &&
    eNote.value !== null &&
    parseFloat(eLat.value) == 0 &&
    parseFloat(eLng.value) !== 0 &&
    eNote.value !== ""
  ) {
    const lat: number = parseFloat(eLat.value);
    const lng: number = parseFloat(eLng.value);
    const note: string = eNote.value;
    const content: string = `?lat=${lat}&lon=${lng}&text=${encodeURIComponent(
      note
    )}`;
    const options: { headers: { Authorization: string }, method: string } = {
      method: "POST",
      headers: {
        Authorization: "Basic $OSM_CREDITENTIALS",
      },
    };
    const settings: JQueryAjaxSettings = {
      url: NOTE_API + content,
      type: "post",
      headers: options.headers,
      error: function (data, textStatus, err) {
        window.dialog.setContent(
          '<h1>Votre note n\'à pas été envoyée <i class="zmdi zmdi-mood-bad"></i></h1><br/>Veuillez ré-essayer ultérieurement.'
        );
        /* eslint-enable max-len */
        /* declencher un evenement??? */
        // sendNote(data); // temp
        setTimeout(() => {
          window.dialog.close();
        }, 5000); // on ferme après 5 sec
      },
      success: function (data) {
        /* eslint-disable max-len */
        window.dialog.setContent(
          '<h1>Votre note à été envoyée <i class="zmdi zmdi-mood"></i></h1><br/>Merci pour votre contribution.'
        );
        /* eslint-enable max-len */
        /* declencher un evenement??? */
        // sendNote(data); // temp
        setTimeout(() => {
          window.dialog.close();
        }, 5000); // on ferme après 5 sec

        // TODO: window.dialog.destroy(); // cela reduira l'empreinte mémoire.
      },
    };
    $.ajax(
      settings
    ); /* TODO: Changer pour L.Util.ajax() pour supprimer la dépendece avec Jquery */
  }
};
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
/* Old function
function resetNote() {
  document.getElementById("noteholder").className = "noteholder hidden";
  document.getElementById("noteok").className = "noteok hidden";
  document.getElementById("newnote").className = "note";
  window.map.removeLayer(notesItems);
}
*/
/* eslint-enable no-unused-vars */

window.map.on("draw:created", (e) => {
  const layer = e.layer;
  const url = `${REVERSE_URL}lon=${layer._latlng.lng}&lat=${layer._latlng.lat}`;
  /* eslint-disable no-unused-vars */
  const req: JQueryXHR = $.ajax(url, {
    dataType: "json",
  });
  /* eslint-enable no-unused-vars */
  L.Util.ajax(url).then((data) => {
    let HtmlCity: string = "";
    let city: string = "";
    if (data.features[0]) {
      //city = data.features[0].properties.city;
      HtmlCity = `<span class="city">\n près de ${data.features[0].properties.city}<span>`;
    }
    notesItems.addLayer(layer);
    window.map.addLayer(notesItems);

    window.dialog = L.control
      .dialog({
        minSize: [400, 50],
        size: [800, 600],
      })
      .setContent(
        [
          `<div class="modal-header"><h2>Nouvelle demande de correction de la carte ${HtmlCity} :</h2></div>`,
          "<hr>",
          '<div class="modal-body"><textarea id="textnote" class="textnote" name="textnote" autofocus="yes"></textarea></div>',
          '<div class="modal-footer">',
          `<input type="hidden" id="lat" name="lat" value="${layer._latlng.lat}">`,
          `<input type="hidden" id="lng" name="lng" value="${layer._latlng.lng}">`,
          '<input type="submit" class="topcoat-button--large" value="Soumettre la note" ',
          'onclick=" window.addNote() ">',
          '<input type="submit" class="topcoat-button--large close" value="Annuler" onclick="window.dialog.close();">',
          "</div>",
        ].join("")
      )
      .addTo(window.map);
    window.dialog.unlock();
  });
});

// translates!
L.drawLocal.draw.toolbar.buttons.marker =
  "Signaler une erreur ou un oublis sur la carte.";
L.drawLocal.draw.toolbar.actions.title = "Annuler le signalement";
L.drawLocal.draw.toolbar.actions.text = "Annuler";
L.drawLocal.draw.handlers.marker.tooltip.start =
  "Placez l'emplacement de l'erreur sur la carte.";

window.map.addControl(notesControl);
