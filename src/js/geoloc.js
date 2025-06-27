/**
 * Contrôle de géolocalisation Leaflet amélioré
 * @module geoloc
 */

/**
 * Centre la carte sur la position fournie et met à jour l'icône.
 * @param {GeolocationPosition} position
 */
const showPosition = (position) => {
  const icon = document.getElementById("geoloc_icon");
  if (window.map) {
    window.map.setView([
      position.coords.latitude,
      position.coords.longitude,
    ], 16);
    if (icon) icon.className = "zmdi zmdi-2x zmdi-gps-dot";
  }
};

/**
 * Demande la position de l'utilisateur et met à jour l'icône.
 */
window.getLocation = () => {
  const icon = document.getElementById("geoloc_icon");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, (err) => {
      if (icon) icon.className = "zmdi zmdi-2x zmdi-gps-off";
      // Optionnel : afficher une notification d'erreur
      // console.error('Erreur de géolocalisation', err);
    });
    if (icon) icon.className = "zmdi zmdi-2x zmdi-gps";
  }
};

/**
 * Contrôle Leaflet pour la géolocalisation
 */
const GeoLoc = L.Control.extend({
  options: {
    position: "topright",
  },
  onAdd: function () {
    const container = L.DomUtil.create("div", "leaflet-control-geoloc");
    container.innerHTML =
      '<span onClick="getLocation();" id="geoloc" class="geoloc"><i class="zmdi zmdi-2x zmdi-gps-off" id="geoloc_icon"></i></span>';
    return container;
  },
});

if (window.map) {
  window.map.addControl(new GeoLoc());
}
