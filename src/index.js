/**
 * @flow
 *
 * @format
 */

import "opensans-npm-webfont";

// Fonts
require("material-design-iconic-font/dist/css/material-design-iconic-font.css");
// Stylesheets
require("./scss/style.scss");

// Imgs
require("leaflet/dist/images/marker-icon-2x.png");
require("leaflet/dist/images/marker-icon.png");
require("leaflet/dist/images/marker-shadow.png");

// JS
require.ensure(["es6-promise"], function() {
  require("es6-promise");
});

require.ensure(["./js/map"], function() {
  require("./js/map");
});
