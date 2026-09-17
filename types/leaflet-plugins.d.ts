/* eslint-disable no-unused-vars */
import * as L from "leaflet";
import type { Feature, Point, GeoJsonObject } from "geojson";

export type PhotonFeatureType =
  | "housenumber"
  | "street"
  | "locality"
  | "hamlet"
  | "village"
  | "city"
  | "commune";

export interface PhotonProperties {
  type?: PhotonFeatureType;
  name?: string;
  city?: string;
  context?: string;
  label?: string;
}

export type PhotonFeature = Feature<Point, PhotonProperties>;

export interface PhotonSearchChoice {
  feature: PhotonFeature;
}

export interface PhotonControlOptions extends L.ControlOptions {
  resultsHandler?: (geojson: GeoJsonObject) => void;
  placeholder?: string;
  url?: string;
  formatResult?: (feature: PhotonFeature, el: HTMLElement) => void;
  noResultLabel?: string;
  feedbackLabel?: string;
  feedbackEmail?: string;
  minChar?: (val: string) => boolean;
  submitDelay?: number;
}

export interface PhotonReverseOptions {
  url: string;
  handleResults: (data: { features?: PhotonFeature[] }) => void;
}

declare module "leaflet" {
  namespace Control {
    class Photon extends L.Control {
      constructor(options?: PhotonControlOptions);
      search: {
        RESULTS: PhotonSearchChoice[];
        CURRENT: number;
        hide: () => void;
        input: HTMLInputElement;
        fire: (type: string, data?: unknown) => void;
        onSelected: (feature: PhotonFeature) => void;
        setChoice: (choice?: PhotonSearchChoice) => void;
      };
    }
  }

  class PhotonReverse {
    constructor(options: PhotonReverseOptions);
    doReverse(latlng: L.LatLngExpression): void;
  }

  class Hash {
    constructor(map: L.Map);
  }
}

declare module "leaflet-hash";
declare module "leaflet.photon";

declare global {
  interface Window {
    map?: L.Map | null;
    L?: typeof L;
  }
}

export {};
