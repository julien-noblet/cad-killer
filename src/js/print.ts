/**
 * Capture et impression de la carte au format paysage
 *
 * @format
 */

function getCurrentTiles(mapElement: HTMLElement): HTMLImageElement[] {
  const currentTiles: HTMLImageElement[] = [];
  const map =
    (typeof window !== "undefined" ? (window as any).map : null) ||
    (mapElement as any)["_leaflet_map"];

  if (!map || typeof map.eachLayer !== "function") {
    return currentTiles;
  }

  map.eachLayer((layer: any) => {
    /* eslint-disable no-underscore-dangle */
    if (!layer._tiles) return;

    const currentZoom =
      layer._tileZoom !== undefined
        ? layer._tileZoom
        : typeof map.getZoom === "function"
          ? map.getZoom()
          : undefined;
    const currentLevelEl = layer._level ? layer._level.el : null;
    if (currentLevelEl && currentLevelEl.style.display === "none") return;

    for (const k of Object.keys(layer._tiles)) {
      const t = layer._tiles[k];
      if (
        t?.el?.complete &&
        t.el.naturalWidth > 0 &&
        t.coords?.z === currentZoom
      ) {
        currentTiles.push(t.el);
      }
    }
    /* eslint-enable no-underscore-dangle */
  });

  return currentTiles;
}

function drawElements(
  ctx: CanvasRenderingContext2D,
  elements: ArrayLike<HTMLImageElement | HTMLCanvasElement>,
  mapRect: DOMRect,
): void {
  for (const el of Array.from(elements)) {
    if ("naturalWidth" in el && (!el.complete || el.naturalWidth === 0)) {
      continue;
    }
    const r = el.getBoundingClientRect();
    ctx.globalAlpha = parseFloat(window.getComputedStyle(el).opacity) || 1;
    ctx.drawImage(
      el,
      r.left - mapRect.left,
      r.top - mapRect.top,
      r.width,
      r.height,
    );
  }
}

function drawAttribution(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  const attributionEl = document.querySelector<HTMLElement>(
    ".leaflet-control-attribution",
  );
  const attrText = attributionEl?.textContent?.replace(/\s+/g, " ").trim();
  if (!attrText) return;

  ctx.save();
  ctx.font =
    '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const tm = ctx.measureText(attrText);
  const boxW = Math.min(w - 20, Math.round(tm.width + 32));
  const boxH = 26;
  const boxX = Math.round((w - boxW) / 2);
  const boxY = h - boxH;

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.lineWidth = 1;

  if (typeof (ctx as any).roundRect === "function") {
    ctx.beginPath();
    (ctx as any).roundRect(boxX, boxY, boxW, boxH, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);
  }

  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(attrText, w / 2, boxY + boxH / 2);
  ctx.restore();
}

export function captureMapToCanvas(mapElement: HTMLElement): HTMLCanvasElement {
  const mapRect = mapElement.getBoundingClientRect();
  const w = Math.round(mapRect.width);
  const h = Math.round(mapRect.height);

  const scaleFactor = 2;
  const canvas = document.createElement("canvas");
  canvas.width = w * scaleFactor;
  canvas.height = h * scaleFactor;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scaleFactor, scaleFactor);
  ctx.fillStyle = "#f8f4f0";
  ctx.fillRect(0, 0, w, h);

  const currentTiles = getCurrentTiles(mapElement);
  const tilesToDraw =
    currentTiles.length > 0
      ? currentTiles
      : mapElement.querySelectorAll<HTMLImageElement>(
          ".leaflet-tile-pane .leaflet-tile-container:last-child img",
        );

  drawElements(ctx, tilesToDraw, mapRect);
  drawElements(
    ctx,
    mapElement.querySelectorAll<HTMLCanvasElement>(
      ".leaflet-overlay-pane canvas",
    ),
    mapRect,
  );
  drawElements(
    ctx,
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-shadow-pane img"),
    mapRect,
  );
  drawElements(
    ctx,
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-marker-pane img"),
    mapRect,
  );

  drawAttribution(ctx, w, h);

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

  const reverseLabel = document.querySelector(".reverse-label");
  const reverseText = reverseLabel?.textContent?.trim() || "";

  let printLabel = document.getElementById("print-label");
  if (!printLabel) {
    printLabel = document.createElement("div");
    printLabel.id = "print-label";
    printLabel.className = "print-label";
  }
  printLabel.textContent = reverseText;

  let printMapWrap = document.getElementById("print-map-wrap");
  if (!printMapWrap) {
    printMapWrap = document.createElement("div");
    printMapWrap.id = "print-map-wrap";
    printMapWrap.className = "print-map-wrap";
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
    printMapWrap.replaceChildren(printImg);
  } catch {
    // Si canvas contaminé (CORS), injection directe du canvas
    printMapWrap.replaceChildren(canvas);
  }

  printContainer.replaceChildren(printLabel, printMapWrap);

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

    if (map) {
      /* eslint-disable no-underscore-dangle */
      const isPending =
        Boolean((map as any)._animatingZoom) || areTilesLoading(map);
      if (isPending) {
        await new Promise<void>((resolve) => {
          let elapsed = 0;
          const interval = setInterval(() => {
            elapsed += 50;
            const isAnimating = Boolean((map as any)._animatingZoom);
            const loading = areTilesLoading(map);
            if ((!isAnimating && !loading) || elapsed >= 2000) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
        });
      }
      /* eslint-enable no-underscore-dangle */
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
