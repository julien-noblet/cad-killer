/**
 * @format
 */

/**
 * Coordonnées du centre de la carte par défaut [lat, lon]
 */
export const CENTER = [46.495, 2.201];
/**
 * URL de l'API de recherche d'adresse
 */
export const API_URL = "//api-adresse.data.gouv.fr/search/?";
/**
 * URL de l'API de géocodage inverse
 */
export const REVERSE_URL = "//api-adresse.data.gouv.fr/reverse/?";
/**
 * Liste des noms de villes très courts (pour gestion d'affichage)
 */
export const SHORT_CITY_NAMES = [
  "y", "ay", "bu", "by", "eu", "fa", "gy", "oo", "oz", "py", "ri", "ry", "sy", "ur", "us", "uz",
];
/**
 * Attributions à afficher sur la carte
 */
export const ATTRIBUTIONS =
  "&copy; <a href='http://www.openstreetmap.org/copyright'>Contributeurs de OpenStreetMap</a> | <a href='https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/'>Adresses BAN</a> sous licence ODbL";
/**
 * Clé d'accès IGN
 */
export const IGN_KEY = "3sk4po838nk0byb23gft0qs5";
/**
 * Nom de la couche IGN par défaut
 */
export const IGN_LAYER = "GEOGRAPHICALGRIDSYSTEMS.MAPS";
/**
 * Couche IGN allégée
 */
export const IGN_LAYER_LITE = "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2";
/**
 * Couche orthophoto IGN
 */
export const IGN_ORTHO = "ORTHOIMAGERY.ORTHOPHOTOS";
/**
 * Credentials OSM (base64)
 */
export const OSM_CREDENTIALS = "Q0FELUtJTExFUjpkdHl2dWRlbnQ=";
/**
 * URL de l'API OSM Notes
 */
export const NOTE_API = "//api.openstreetmap.org/api/0.6/notes";
