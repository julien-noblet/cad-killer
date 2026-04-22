/** @format */

import { getMapInstance, setMapInstance } from "./mapContext";

describe("mapContext", () => {
  test("returns null when no map is registered", () => {
    setMapInstance(null);
    expect(getMapInstance()).toBeNull();
  });

  test("returns registered map instance", () => {
    const fakeMap = /** @type {any} */ ({ id: "map" });
    setMapInstance(fakeMap);
    expect(getMapInstance()).toBe(fakeMap);
  });
});
