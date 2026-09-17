/**
 * Capture et impression de la carte au format paysage
 *
 * @format
 */

export function captureMapToCanvas(mapElement: HTMLElement): HTMLCanvasElement {
  const mapRect = mapElement.getBoundingClientRect();
  const w = Math.round(mapRect.width);
  const h = Math.round(mapRect.height);

  // Facteur 2 pour une netteté d'impression haute résolution (Retina)
  const scaleFactor = 2;
  const canvas = document.createElement("canvas");
  canvas.width = w * scaleFactor;
  canvas.height = h * scaleFactor;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scaleFactor, scaleFactor);

  // Fond neutre
  ctx.fillStyle = "#f8f4f0";
  ctx.fillRect(0, 0, w, h);

  // 1. Récupérer STRICTEMENT les tuiles du niveau de zoom courant
  const currentTiles: HTMLImageElement[] = [];
  const map =
    (typeof window !== "undefined" ? (window as any).map : null) ||
    (mapElement as any)["_leaflet_map"];

  if (map && typeof map.eachLayer === "function") {
    map.eachLayer((layer: any) => {
      /* eslint-disable no-underscore-dangle */
      if (layer._tiles && layer._level && layer._level.el) {
        const currentLevelEl = layer._level.el;
        const currentZoom = layer._tileZoom;
        for (const k of Object.keys(layer._tiles)) {
          const t = layer._tiles[k];
          if (
            t &&
            t.el &&
            t.coords &&
            t.coords.z === currentZoom &&
            t.el.parentElement === currentLevelEl &&
            t.el.complete &&
            t.el.naturalWidth > 0 &&
            currentLevelEl.style.display !== "none"
          ) {
            currentTiles.push(t.el);
          }
        }
      }
      /* eslint-enable no-underscore-dangle */
    });
  }

  // Fallback: dernier conteneur de tuiles (zoom le plus récent) si accès layer indisponible
  const tilesToDraw =
    currentTiles.length > 0
      ? currentTiles
      : Array.from(
          mapElement.querySelectorAll<HTMLImageElement>(
            ".leaflet-tile-pane .leaflet-tile-container:last-child img",
          ),
        );

  for (const img of tilesToDraw) {
    const r = img.getBoundingClientRect();
    const x = r.left - mapRect.left;
    const y = r.top - mapRect.top;
    ctx.globalAlpha = parseFloat(window.getComputedStyle(img).opacity) || 1;
    ctx.drawImage(img, x, y, r.width, r.height);
  }

  // 2. Dessiner les overlays vectoriels éventuels (canvas)
  const overlayCanvases = Array.from(
    mapElement.querySelectorAll<HTMLCanvasElement>(
      ".leaflet-overlay-pane canvas",
    ),
  );
  for (const cvs of overlayCanvases) {
    const r = cvs.getBoundingClientRect();
    ctx.globalAlpha = parseFloat(window.getComputedStyle(cvs).opacity) || 1;
    ctx.drawImage(
      cvs,
      r.left - mapRect.left,
      r.top - mapRect.top,
      r.width,
      r.height,
    );
  }

  // 3. Dessiner les ombres des marqueurs
  const shadows = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-shadow-pane img"),
  );
  for (const shadow of shadows) {
    if (shadow.complete && shadow.naturalWidth > 0) {
      const r = shadow.getBoundingClientRect();
      ctx.globalAlpha =
        parseFloat(window.getComputedStyle(shadow).opacity) || 1;
      ctx.drawImage(
        shadow,
        r.left - mapRect.left,
        r.top - mapRect.top,
        r.width,
        r.height,
      );
    }
  }

  // 4. Dessiner les marqueurs (épingles)
  const markers = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-marker-pane img"),
  );
  for (const marker of markers) {
    if (marker.complete && marker.naturalWidth > 0) {
      const r = marker.getBoundingClientRect();
      ctx.globalAlpha =
        parseFloat(window.getComputedStyle(marker).opacity) || 1;
      ctx.drawImage(
        marker,
        r.left - mapRect.left,
        r.top - mapRect.top,
        r.width,
        r.height,
      );
    }
  }

  // 5. Dessiner la mention d'attribution légale au bas de l'image
  const attributionEl = document.querySelector<HTMLElement>(
    ".leaflet-control-attribution",
  );
  const attrText = attributionEl?.textContent?.replace(/\s+/g, " ").trim();
  if (attrText) {
    ctx.save();
    ctx.font =
      '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tm = ctx.measureText(attrText);
    const boxW = tm.width + 16;
    const boxH = 22;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(0, h - boxH, boxW, boxH);
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(attrText, 8, h - boxH / 2);
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  return canvas;
}

let isGenerating = false;
let imageReady = false;

export function preparePrintImage(): boolean {
  const mapElement = document.getElementById("map");
  if (!mapElement) return false;

  let printContainer = document.getElementById("print-container");
  if (!printContainer) {
    printContainer = document.createElement("div");
    printContainer.id = "print-container";
    document.body.appendChild(printContainer);
  }

  const canvas = captureMapToCanvas(mapElement);
  let printImg = document.getElementById(
    "print-image",
  ) as HTMLImageElement | null;
  if (!printImg) {
    printImg = document.createElement("img");
    printImg.id = "print-image";
    printImg.alt = "Carte imprimée";
  }

  try {
    const dataUrl = canvas.toDataURL("image/png");
    printImg.src = dataUrl;
    printContainer.replaceChildren(printImg);
  } catch {
    // Si canvas contaminé (CORS), injection directe du canvas
    printContainer.replaceChildren(canvas);
  }

  imageReady = true;
  document.body.classList.add("is-printing-image");
  return true;
}

function areTilesLoading(map: any): boolean {
  if (!map || typeof map.eachLayer !== "function") return false;
  let loading = false;
  map.eachLayer((layer: any) => {
    /* eslint-disable no-underscore-dangle */
    if (layer._loading) {
      loading = true;
    }
    if (layer._tiles && layer._tileZoom !== undefined) {
      for (const k of Object.keys(layer._tiles)) {
        const t = layer._tiles[k];
        if (t && t.coords && t.coords.z === layer._tileZoom && t.el) {
          if (!t.el.complete || t.el.naturalWidth === 0) {
            loading = true;
          }
        }
      }
    }
    /* eslint-enable no-underscore-dangle */
  });
  return loading;
}

export async function triggerPrint(): Promise<void> {
  if (isGenerating) return;
  isGenerating = true;
  try {
    const mapElement = document.getElementById("map");
    const map =
      (typeof window !== "undefined" ? (window as any).map : null) ||
      (mapElement ? (mapElement as any)["_leaflet_map"] : null);

    if (map && areTilesLoading(map)) {
      await new Promise<void>((resolve) => {
        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 50;
          if (!areTilesLoading(map) || elapsed >= 1000) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    }

    const ok = preparePrintImage();
    if (ok) {
      window.print();
    }
  } finally {
    isGenerating = false;
  }
}

export function initPrintListeners(): void {
  if (typeof window === "undefined") return;

  // Interception de Ctrl+P / Cmd+P pour générer l'image avant l'impression
  window.addEventListener("keydown", async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      await triggerPrint();
    }
  });

  // Si l'impression est déclenchée via le menu navigateur (Fichier > Imprimer)
  window.addEventListener("beforeprint", () => {
    if (!imageReady) {
      preparePrintImage();
    }
  });

  window.addEventListener("afterprint", () => {
    imageReady = false;
    document.body.classList.remove("is-printing-image");
  });

  // Méthodes accessibles pour les tests automatisés
  (window as any).triggerPrintMap = triggerPrint;
  (window as any).preparePrintImage = preparePrintImage;
}
