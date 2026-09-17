/** @format */

import {
  CENTER,
  API_URL,
  REVERSE_URL,
  SHORT_CITY_NAMES,
  ATTRIBUTIONS,
} from "./config";

function isURL(url) {
  expect(typeof url).toEqual("string");
  expect(URL.canParse(url)).toBe(true);
}

describe("config.js check globals", () => {
  describe("CENTER:", () => {
    test("CENTER is an array with valid coordinates", () => {
      expect(Array.isArray(CENTER)).toBe(true);
      expect(CENTER.length).toBe(2);
      const [lat, lng] = CENTER;
      expect(typeof lat).toBe("number");
      expect(typeof lng).toBe("number");
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThanOrEqual(180);
      expect(lat).toBeCloseTo(46.495, 2);
      expect(lng).toBeCloseTo(2.201, 2);
    });
  });

  test("API_URL is an HTTPS geocoding search URL", () => {
    isURL(API_URL);
    const parsed = new URL(API_URL);
    expect(parsed.protocol).toBe("https:");
    expect(parsed.pathname).toContain("geocodage/search");
  });

  test("REVERSE_URL is an HTTPS reverse geocoding URL", () => {
    isURL(REVERSE_URL);
    const parsed = new URL(REVERSE_URL);
    expect(parsed.protocol).toBe("https:");
    expect(parsed.pathname).toContain("geocodage/reverse");
  });

  test("SHORT_CITY_NAMES is a Set containing short French communes", () => {
    expect(SHORT_CITY_NAMES instanceof Set).toBe(true);
    expect(SHORT_CITY_NAMES.size).toBe(16);
    expect(SHORT_CITY_NAMES.has("y")).toBe(true);
    expect(SHORT_CITY_NAMES.has("eu")).toBe(true);
    expect(SHORT_CITY_NAMES.has("by")).toBe(true);
    expect(SHORT_CITY_NAMES.has("paris")).toBe(false);
    expect(SHORT_CITY_NAMES.has("")).toBe(false);
    SHORT_CITY_NAMES.forEach((city) => {
      expect(typeof city).toBe("string");
      expect(city.length).toBeLessThanOrEqual(2);
      expect(city).toBe(city.toLowerCase());
    });
  });

  test("ATTRIBUTIONS contains OSM and BAN credits", () => {
    expect(typeof ATTRIBUTIONS).toBe("string");
    expect(ATTRIBUTIONS).toContain("OpenStreetMap");
    expect(ATTRIBUTIONS).toContain("Adresses BAN");
    expect(ATTRIBUTIONS).toContain("ODbL");
  });
});
