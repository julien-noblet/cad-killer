/**
 * @format
 */

import "opensans-npm-webfont";
import "material-design-iconic-font/dist/css/material-design-iconic-font.css";
import "./scss/style.scss";
import "leaflet/dist/images/marker-icon-2x.png";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

(async () => {
  await import("es6-promise/auto");
  await import("./js/map");
})();