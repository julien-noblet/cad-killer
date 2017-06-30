import {
  CENTER,
  API_URL,
  REVERSE_URL,
  SHORT_CITY_NAMES,
  ATTRIBUTIONS,
  IGN_KEY,
  IGN_LAYER,
  IGN_LAYER_LITE,
  MY_POUCHDB,
  LOCAL_POUCHDB,
  OSM_CREDITENTIALS,
  NOTE_API
} from "./config";

function isURL(url) {
  expect(typeof url).toEqual("string");
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

  test("MY_POUCHDB is an URL", () => {
    isURL(MY_POUCHDB);
  });

  test("LOCAL_POUCHDB is a string", () => {
    expect(typeof LOCAL_POUCHDB).toEqual("string");
  });

  test("OSM_CREDITENTIALS seems ok", () => {
    expect(typeof OSM_CREDITENTIALS).toEqual("string");
    expect(OSM_CREDITENTIALS.length).toBe(28);
    expect(OSM_CREDITENTIALS[OSM_CREDITENTIALS.length - 1]).toEqual("=");
  });

  test("NOTE_API is an URL", () => {
    isURL(NOTE_API);
  });
});
