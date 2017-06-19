import L from 'leaflet';
import { REVERSE_URL } from './config';

L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: 'topright', // hack
  },

  onAdd: () => {
    const container = L.DomUtil.create('div', 'reverse-label');
    const reverse = new L.PhotonReverse({
      url: REVERSE_URL,
      handleResults: (data) => {
        container.innerHTML = `Carte centrée sur «${data.features[0].properties.label}»`;
      },
      /* eslint-enable no-unused-vars */
    });

    Window.map.on('moveend', () => {
      if (Window.map.getZoom() > 14) {
        reverse.doReverse(Window.map.getCenter());
        document.getElementById('head').className += ' headmasked';
        document.getElementById('map').className += ' nohead';
      } else {
        container.innerHTML = '';
      }
    });
    return container;
  },
});

new L.Control.ReverseLabel().addTo(Window.map);
