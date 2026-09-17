/**
 * Capture et impression de la carte au format paysage
 *
 * @format
 */

export function captureMapToCanvas(mapElement: HTMLElement): HTMLCanvasElement {
  const mapRect = mapElement.getBoundingClientRect();
  const w = Math.round(mapRect.width);
  const h = Math.round(mapRect.height);

  // Proportions A4 paysage = 297mm / 210mm = 1.4142857
  const printRatio = 297 / 210;

  // Calcul du cadrage pour remplir exactement la feuille paysage sans couper la vue écran
  let canvasW: number;
  let canvasH: number;
  let offsetX = 0;
  let offsetY = 0;

  if (w / h >= printRatio) {
    // Écran plus large que A4 : conserver toute la largeur, étendre la hauteur
    canvasW = w;
    canvasH = Math.round(w / printRatio);
    offsetY = Math.round((canvasH - h) / 2);
  } else {
    // Écran plus étroit ou portrait : conserver toute la hauteur, étendre la largeur
    canvasH = h;
    canvasW = Math.round(h * printRatio);
    offsetX = Math.round((canvasW - w) / 2);
  }

  // Facteur 2 pour une netteté d'impression haute résolution (Retina)
  const scaleFactor = 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvasW * scaleFactor;
  canvas.height = canvasH * scaleFactor;
  canvas.style.width = `${canvasW}px`;
  canvas.style.height = `${canvasH}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scaleFactor, scaleFactor);

  // Fond neutre
  ctx.fillStyle = "#f8f4f0";
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 1. Récupérer STRICTEMENT les tuiles du niveau de zoom courant et actives
  // pour éviter tout décalage avec des tuiles d'un zoom précédent en cours de transition
  const currentTiles: HTMLImageElement[] = [];
  const map = typeof window !== "undefined" ? (window as any).map : null;

  if (map && typeof map.eachLayer === "function") {
    map.eachLayer((layer: any) => {
      /* eslint-disable no-underscore-dangle */
      if (layer._tiles) {
        for (const k of Object.keys(layer._tiles)) {
          const t = layer._tiles[k];
          if (
            t &&
            t.current &&
            t.el &&
            t.el.complete &&
            t.el.naturalWidth > 0 &&
            t.el.parentElement?.style.display !== "none"
          ) {
            currentTiles.push(t.el);
          }
        }
      }
      /* eslint-enable no-underscore-dangle */
    });
  }

  // Fallback DOM si accès direct aux layers non disponible
  const tilesToDraw =
    currentTiles.length > 0
      ? currentTiles
      : Array.from(
          mapElement.querySelectorAll<HTMLImageElement>(
            ".leaflet-tile-pane img",
          ),
        );

  for (const img of tilesToDraw) {
    const r = img.getBoundingClientRect();
    const x = Math.round(r.left - mapRect.left + offsetX);
    const y = Math.round(r.top - mapRect.top + offsetY);
    const tw = Math.round(r.width);
    const th = Math.round(r.height);
    ctx.globalAlpha = parseFloat(window.getComputedStyle(img).opacity) || 1;
    ctx.drawImage(img, x, y, tw, th);
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
      Math.round(r.left - mapRect.left + offsetX),
      Math.round(r.top - mapRect.top + offsetY),
      Math.round(r.width),
      Math.round(r.height),
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
        Math.round(r.left - mapRect.left + offsetX),
        Math.round(r.top - mapRect.top + offsetY),
        Math.round(r.width),
        Math.round(r.height),
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
        Math.round(r.left - mapRect.left + offsetX),
        Math.round(r.top - mapRect.top + offsetY),
        Math.round(r.width),
        Math.round(r.height),
      );
    }
  }

  // 5. Dessiner la mention d'attribution légale au bas de l'image
  const attributionEl = document.querySelector<HTMLElement>(
    ".leaflet-control-attribution",
  );
  const attrText = attributionEl?.textContent?.trim();
  if (attrText) {
    ctx.save();
    ctx.font =
      '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tm = ctx.measureText(attrText);
    const boxW = tm.width + 16;
    const boxH = 22;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(0, canvasH - boxH, boxW, boxH);
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(attrText, 8, canvasH - boxH / 2);
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

export function triggerPrint(): void {
  if (isGenerating) return;
  isGenerating = true;
  try {
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
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      triggerPrint();
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
