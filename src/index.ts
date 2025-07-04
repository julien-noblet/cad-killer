/**
 * Point d'entrée principal de l'application CAD-Killer
 * Charge les polices, styles, images et initialise la carte.
 * Voir la documentation dans le README pour la structure Webpack.
 * @format
 */

import "opensans-npm-webfont";
import "material-design-iconic-font/dist/css/material-design-iconic-font.css";
import "./scss/style.scss";
import "leaflet/dist/images/marker-icon-2x.png";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";


await import("./js/map");
