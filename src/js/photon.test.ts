/** @format */

import type { PhotonFeature } from "../../types/leaflet-plugins";
import {
  ZOOM_BY_FEATURE_TYPE,
  FEATURE_TYPE_LABELS,
  photonControlOptions,
  formatResult,
} from "./photon";
import { API_URL } from "./config";

describe("photon.ts check search control options and formatting", () => {
  describe("ZOOM_BY_FEATURE_TYPE:", () => {
    test("defines expected zoom levels per feature type", () => {
      expect(ZOOM_BY_FEATURE_TYPE.housenumber).toBe(18);
      expect(ZOOM_BY_FEATURE_TYPE.street).toBe(16);
      expect(ZOOM_BY_FEATURE_TYPE.locality).toBe(16);
      expect(ZOOM_BY_FEATURE_TYPE.hamlet).toBe(16);
      expect(ZOOM_BY_FEATURE_TYPE.village).toBe(12);
      expect(ZOOM_BY_FEATURE_TYPE.city).toBe(12);
      expect(ZOOM_BY_FEATURE_TYPE.commune).toBe(12);
    });
  });

  describe("FEATURE_TYPE_LABELS:", () => {
    test("maps types to expected French labels", () => {
      expect(FEATURE_TYPE_LABELS.housenumber).toBe("numéro");
      expect(FEATURE_TYPE_LABELS.street).toBe("rue");
      expect(FEATURE_TYPE_LABELS.locality).toBe("lieu-dit");
      expect(FEATURE_TYPE_LABELS.hamlet).toBe("hamlet");
      expect(FEATURE_TYPE_LABELS.village).toBe("village");
      expect(FEATURE_TYPE_LABELS.city).toBe("ville");
      expect(FEATURE_TYPE_LABELS.commune).toBe("commune");
    });
  });

  describe("photonControlOptions:", () => {
    test("has correct API url, position, and delay", () => {
      expect(photonControlOptions.url).toBe(API_URL);
      expect(photonControlOptions.position).toBe("topright");
      expect(photonControlOptions.submitDelay).toBe(200);
      expect(photonControlOptions.placeholder).toBeTruthy();
    });

    test("minChar handles short city names and character length", () => {
      const minChar = photonControlOptions.minChar;
      expect(typeof minChar).toBe("function");
      if (typeof minChar === "function") {
        expect(minChar("y")).toBe(true);
        expect(minChar("eu")).toBe(true);
        expect(minChar("by")).toBe(true);
        expect(minChar("a")).toBe(false);
        expect(minChar("pa")).toBe(false);
        expect(minChar("par")).toBe(true);
        expect(minChar("paris")).toBe(true);
      }
    });
  });

  describe("formatResult:", () => {
    test("formats standard feature with name, type, city, and context", () => {
      const el = document.createElement("li");
      const feature: PhotonFeature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [1.4442, 43.6047] },
        properties: {
          label: "14 Rue Michel Labrousse 31100 Toulouse",
          name: "14 Rue Michel Labrousse",
          type: "street",
          city: "Toulouse",
          context: "31, Haute-Garonne, Occitanie",
        },
      };

      formatResult(feature, el);

      const title = el.querySelector("strong");
      expect(title).not.toBeNull();
      expect(title?.textContent).toContain("14 Rue Michel Labrousse");

      const typeSpan = title?.querySelector("span.type");
      expect(typeSpan).not.toBeNull();
      expect(typeSpan?.textContent).toBe("rue");

      const small = el.querySelector("small");
      expect(small).not.toBeNull();
      expect(small?.textContent).toContain("Toulouse");
      expect(small?.textContent).toContain("31, Haute-Garonne, Occitanie");
    });

    test("does not duplicate city when city equals name", () => {
      const el = document.createElement("li");
      const feature: PhotonFeature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
        properties: {
          label: "Paris",
          name: "Paris",
          type: "city",
          city: "Paris",
          context: "75, Paris, Île-de-France",
        },
      };

      formatResult(feature, el);

      const small = el.querySelector("small");
      expect(small?.textContent).toBe("75, Paris, Île-de-France");
    });

    test("safely escapes HTML tags to prevent XSS", () => {
      const el = document.createElement("li");
      const feature: PhotonFeature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 0] },
        properties: {
          label: "Malicious",
          name: "<script>alert('xss')</script><img src=x onerror=alert(1)>",
          type: "street",
          city: "<b>City</b>",
          context: "<script>hack()</script>",
        },
      };

      formatResult(feature, el);

      expect(el.querySelector("script")).toBeNull();
      expect(el.querySelector("img")).toBeNull();
      expect(el.textContent).toContain("<script>alert('xss')</script>");
      expect(el.textContent).toContain("<b>City</b>");
    });
  });
});
