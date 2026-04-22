import "leaflet";

declare module "leaflet-hash";
declare module "leaflet.photon";
declare module "leaflet.browser.print/dist/leaflet.browser.print.min.js";

declare global {
  interface Window {
    map?: import("leaflet").Map | null;
  }
}

export {};
