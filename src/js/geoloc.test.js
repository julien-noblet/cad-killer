/** @format */

import L from "leaflet";
import { ATTRIBUTIONS, CENTER } from "./config";
import { overlayMaps, baseMaps, layerOSMfr } from "./layers";

const div = global.document.createElement("div");
div.setAttribute("id", "map");
global.document.body.appendChild(div);
window.map = L.map("map", {
  attributionControl: false
});
map = window.map;
describe("test Geoloc", () => {
  test("geoloc_icon exist", () => {
    require("./geoloc");
    expect(document.getElementById("geoloc_icon")).toExist;
  });
  test("geoloc_icon is correct", () => {
    expect(document.getElementById("geoloc_icon")).toMatchSnapshot();
  });
});
