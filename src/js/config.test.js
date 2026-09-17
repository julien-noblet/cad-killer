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

  test("SHORT_CITY_NAMES is a Set", () => {
    expect(SHORT_CITY_NAMES instanceof Set).toEqual(true);
  });

  test("ATTRIBUTIONS is a string", () => {
    expect(typeof ATTRIBUTIONS).toEqual("string");
  });
});
