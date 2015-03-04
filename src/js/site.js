/*global map*/
// need map initialised
// edition
var edit = function () {
  var center = map.getCenter();
  var url = 'http://www.openstreetmap.org/edit#map=' + map.getZoom() + '/' + center.lat + '/' + center.lng;
  // console.log('going to ' + url);
  window.open(url, '_blank');
};
