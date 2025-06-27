/** @format */

import {
  CENTER,
  API_URL,
  REVERSE_URL,
  SHORT_CITY_NAMES,
  ATTRIBUTIONS,
  IGN_KEY,
  IGN_LAYER,
  IGN_LAYER_LITE,
  IGN_ORTHO,
  OSM_CREDENTIALS,
  NOTE_API,
} from "./config";

function isURL(url) {
  expect(typeof url).toEqual("string");
  expect(url).toMatch(
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/
  );
}

describe("config.js check globals", () => {
  describe("CENTER:", () => {
    test("CENTER is a array", () => {
      expect(Array.isArray(CENTER)).toEqual(true);
    });
    test("CENTER contain 2 numbers", () => {
      expect(CENTER.length).toBe(2);
      expect(typeof CENTER[0]).toEqual("number");
      expect(typeof CENTER[1]).toEqual("number");
    });
  });

  test("API_URL is an URL", () => {
    isURL(API_URL);
  });

  test("REVERSE_URL is an URL", () => {
    isURL(REVERSE_URL);
  });

  test("SHORT_CITY_NAMES is a array", () => {
    expect(Array.isArray(SHORT_CITY_NAMES)).toEqual(true);
  });

  test("ATTRIBUTIONS is a string", () => {
    expect(typeof ATTRIBUTIONS).toEqual("string");
  });

  test("IGN_KEY seems valid", () => {
    expect(typeof IGN_KEY).toEqual("string");
    expect(IGN_KEY.length).toBe(24);
  });

  test("IGN_LAYER is a string", () => {
    expect(typeof IGN_LAYER).toEqual("string");
  });

  test("IGN_LAYER_LITE is a string", () => {
    expect(typeof IGN_LAYER_LITE).toEqual("string");
  });

  test("IGN_ORTHO is a string", () => {
    expect(typeof IGN_ORTHO).toEqual("string");
    expect(IGN_ORTHO.length).toBeGreaterThan(0);
  });

  test("OSM_CREDENTIALS seems ok", () => {
    expect(typeof OSM_CREDENTIALS).toEqual("string");
    expect(OSM_CREDENTIALS.length).toBe(28);
    expect(OSM_CREDENTIALS[OSM_CREDENTIALS.length - 1]).toEqual("=");
  });

  test("NOTE_API is an URL", () => {
    isURL(NOTE_API);
  });
});
