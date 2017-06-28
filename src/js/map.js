import L from 'leaflet';
import { ATTRIBUTIONS, CENTER, REVERSE_URL } from './config';
import { overlayMaps, baseMaps, layerOSMfr } from './layers';
import { dbinfo, sendLayer } from './stats';
import { photon } from './photon';

require('leaflet-hash');

/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

// connection à la BD:
dbinfo();

// Initialisation de leaflet
Window.map = L.map('map', {
  attributionControl: false,
});


const layers = L.control.layers(baseMaps, overlayMaps);


L.Icon.Default.imagePath = './images/';
Window.map.addLayer(layerOSMfr);

layers.addTo(Window.map);

Window.map.setView(CENTER, 6);

Window.map.dragging.enable();

L.control.attribution({
  position: 'bottomleft',
  prefix: ATTRIBUTIONS,
}).addTo(Window.map);

// ajout hash dans l'URL
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
let hash;
/* eslint-enable no-unused-vars */
hash = new L.Hash(Window.map);
/* eslint-enable prefer-const */

// Chargement des modules:
// require('./photon');
require('./reverseLabel');
require('./notes');
photon();


/* // Not needed
Window.map.on('moveend', function() {
  sendMove({
    lat: Window.map.getCenter().lat,
    lng: Window.map.getCenter().lng,
    zoom: Window.map.getZoom()
  });
});
*/

/*
  Si l'on change de layer (base) -> j'envoie un objet:
  {
    layer: '',
    city: '',
    location: {lat,lng,zoom}
  }

  Nota: est-ce qu je doit déplacer cela dans stats.js?
 */

function onSwitchLayer(layer, switchCase) {
  const url = `${REVERSE_URL}lon=${Window.map.getCenter().lng}&lat=${Window.map.getCenter().lat}`;

  L.Util.ajax(url).then((data) => {
    let city = '';
    let postcode = '';
    if (data.features[0]) {
      city = data.features[0].properties.city;
      postcode = data.features[0].properties.postcode;
    }
    sendLayer({
      layer,
      switchCase,
      city,
      postcode,
      location: {
        lat: Window.map.getCenter().lat,
        lng: Window.map.getCenter().lng,
        zoom: Window.map.getZoom(),
      },
    });
  });
}

Window.map.on('baselayerchange', (e) => {
  onSwitchLayer(e.name, 'switch');
});

Window.map.on('overlayadd', (e) => {
  onSwitchLayer(e.name, 'add-overlay');
});

Window.map.on('overlayremove', (e) => {
  onSwitchLayer(e.name, 'remove-overlay');
});
