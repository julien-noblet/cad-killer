/* global L,
  ATTRIBUTIONS,
  CENTER,
  REVERSE_URL,
  overlayMaps,
  baseMaps,
  layerOSMfr,
  sendLayer
*/

/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

const map = L.map('map', {
  attributionControl: false,
});


const layers = L.control.layers(baseMaps, overlayMaps);
/* eslint-disable no-unused-vars */
let hash;
/* eslint-enable no-unused-vars */


L.Icon.Default.imagePath = './images/';
map.addLayer(layerOSMfr);

layers.addTo(map);

map.setView(CENTER, 6);

L.control.attribution({
  position: 'bottomleft',
  prefix: ATTRIBUTIONS,
}).addTo(map);

// ajout hash dans l'URL
/* eslint-disable prefer-const */
hash = new L.Hash(map);
/* eslint-enable prefer-const */

/* // Not needed
map.on('moveend', function() {
  sendMove({
    lat: map.getCenter().lat,
    lng: map.getCenter().lng,
    zoom: map.getZoom()
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
  const url = `${REVERSE_URL}lon=${map.getCenter().lng}&lat=${map.getCenter().lat}`;

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
        lat: map.getCenter().lat,
        lng: map.getCenter().lng,
        zoom: map.getZoom(),
      },
    });
  });
}

map.on('baselayerchange', (e) => {
  onSwitchLayer(e.name, 'switch');
});

map.on('overlayadd', (e) => {
  onSwitchLayer(e.name, 'add-overlay');
});

map.on('overlayremove', (e) => {
  onSwitchLayer(e.name, 'remove-overlay');
});
