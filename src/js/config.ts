/**
 * @format
 */

export const CENTER: [number, number] = [46.495, 2.201];
export const API_URL = "https://data.geopf.fr/geocodage/search/?";
export const REVERSE_URL = "https://data.geopf.fr/geocodage/reverse/?";
const SHORT_CITIES = [
  "y",
  "ay",
  "bu",
  "by",
  "eu",
  "fa",
  "gy",
  "oo",
  "oz",
  "py",
  "ri",
  "ry",
  "sy",
  "ur",
  "us",
  "uz",
] as const;

export type ShortCityName = (typeof SHORT_CITIES)[number];
export const SHORT_CITY_NAMES: ReadonlySet<string> = new Set<string>(
  SHORT_CITIES,
);
export const ATTRIBUTIONS =
  "&copy; <a href='http://www.openstreetmap.org/copyright'>Contributeurs de OpenStreetMap</a> | <a href='https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/'>Adresses BAN</a> sous licence ODbL";
