/* global L,
          REVERSE_URL,
          map
*/

L.Control.ReverseLabel = L.Control.extend({
  options: {
    position: "topright" // hack
  },

  onAdd: () => {
    const container = L.DomUtil.create("div", "reverse-label"),
      reverse = new L.PhotonReverse({
        url: REVERSE_URL,
        /* eslint-disable no-unused-vars */
        handleResults: (data) => {
          container.innerHTML = "Carte centrée sur «${data.features[0].properties.label}»";
        }
        /* eslint-enable no-unused-vars */
      });

    map.on("moveend", () => {
      if (this.getZoom() > 14) {
        reverse.doReverse(this.getCenter());
        document.getElementById("head").className += " headmasked";
        document.getElementById("map").className += " nohead";
      } else {
        container.innerHTML = "";
      }
    });
    return container;
  }
});

new L.Control.ReverseLabel().addTo(map);
