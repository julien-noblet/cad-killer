/* @flow */

import $ from 'jquery';
import L from 'leaflet';
import { REVERSE_URL, NOTE_API } from './config';
import { sendNote } from './stats';

// require('font-awesome-webpack');
require('leaflet-dialog');
require('leaflet-dialog/Leaflet.Dialog.css');
require('leaflet-draw/dist/images/marker-icon-2x.png');
require('leaflet-draw/dist/images/marker-icon.png');
require('leaflet-draw/dist/images/marker-shadow.png');
require('leaflet-draw');
require('leaflet-ajax');

/* eslint-disable no-unused-vars */
const notesControl = new L.Control.Draw({
  edit: false,
  draw: {
    polyline: false,
    polygon: false,
    rectangle: false,
    circle: false,
  },
});
/* eslint-enable no-unused-vars */

const notesItems = new L.FeatureGroup();

/* eslint-disable no-unused-vars */
Window.addNote = function addNote() {
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  const note = document.getElementById('textnote').value;
  const content = `?lat=${lat}&lon=${lng}&text=${encodeURIComponent(note)}`;
  // console.log('addNote');
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Basic $OSM_CREDITENTIALS',
    },
  };
  $.ajax({ /* TODO: Changer pour L.Util.ajax() pour supprimer la dépendece avec Jquery */
    url: NOTE_API + content,
    type: 'post',
    headers: options.headers,
    success: (data) => {
        /* eslint-disable max-len */
      Window.dialog.setContent('<h1>Votre Note à été envoyée <i class="zmdi zmdi-mood"></i></h1><br/>Merci pour votre contribution.');
        /* eslint-enable max-len */
        /* declencher un evenement??? */
        // sendNote(data); // temp
      setTimeout(() => { Window.dialog.close(); }, 5000); // on ferme après 5 sec
        // TODO: Window.dialog.destroy(); // cela reduira l'empreinte mémoire.
    },
  });
};
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function resetNote() {
  document.getElementById('noteholder').className = 'noteholder hidden';
  document.getElementById('noteok').className = 'noteok hidden';
  document.getElementById('newnote').className = 'note';
  Window.map.removeLayer(notesItems);
}
/* eslint-enable no-unused-vars */


Window.map.on('draw:created', (e) => {
  const layer = e.layer;
  const url = `${REVERSE_URL}lon=${layer._latlng.lng}&lat=${layer._latlng.lat}`;
  /* eslint-disable no-unused-vars */
  const req = $.ajax(url, {
    dataType: 'json',
  });
  /* eslint-enable no-unused-vars */
  L.Util.ajax(url).then((data) => {
    let HtmlCity = '';
    let city = '';
    if (data.features[0]) {
      city = data.features[0].properties.city;
      HtmlCity = `<span class="city">\n près de ${data.features[0].properties.city}<span>`;
    }
    notesItems.addLayer(layer);
    Window.map.addLayer(notesItems);

    Window.dialog = L.control.dialog({
      minSize: [400, 50],
      size: [800, 600],
    })
              .setContent([`<div class="modal-header"><h2>Nouvelle demande de correction de la carte ${HtmlCity} :</h2></div>`,
                '<hr>',
                '<div class="modal-body"><textarea id="textnote" class="textnote" name="textnote" autofocus="yes"></textarea></div>',
                '<div class="modal-footer">',
                `<input type="hidden" id="lat" name="lat" value="${layer._latlng.lat}">`,
                `<input type="hidden" id="lng" name="lng" value="${layer._latlng.lng}">`,
                '<input type="submit" class="topcoat-button--large" value="Soumettre la note" ',
                'onclick=" Window.addNote() ">',
                '<input type="submit" class="topcoat-button--large close" value="Annuler" onclick="Window.dialog.close();">',
                '</div>',
              ].join(''))
              .addTo(Window.map);
    Window.dialog.unlock();
  });
});

// translates!
L.drawLocal.draw.toolbar.buttons.marker = 'Signaler une erreur ou un oublis sur la carte.';
L.drawLocal.draw.toolbar.actions.title = 'Annuler le signalement';
L.drawLocal.draw.toolbar.actions.text = 'Annuler';
L.drawLocal.draw.handlers.marker.tooltip.start = "Placez l'emplacement de l'erreur sur la carte.";

Window.map.addControl(notesControl);
