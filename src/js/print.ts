/**
 * Capture et impression de la carte au format paysage
 *
 * @format
 */

export function captureMapToCanvas(mapElement: HTMLElement): HTMLCanvasElement {
  const mapRect = mapElement.getBoundingClientRect();
  const canvas = document.createElement("canvas");

  const w = Math.round(mapRect.width);
  const h = Math.round(mapRect.height);

  // Capture haute résolution (facteur 2 pour une impression nette)
  const scaleFactor = 2;
  canvas.width = w * scaleFactor;
  canvas.height = h * scaleFactor;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scaleFactor, scaleFactor);

  // Fond neutre de carte
  ctx.fillStyle = "#f8f4f0";
  ctx.fillRect(0, 0, w, h);

  // 1. Dessiner les tuiles du fond de carte (dans l'ordre du DOM)
  const tiles = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-tile-pane img"),
  );
  for (const img of tiles) {
    if (img.complete && img.naturalWidth > 0) {
      const r = img.getBoundingClientRect();
      const x = r.left - mapRect.left;
      const y = r.top - mapRect.top;
      const opacity = parseFloat(window.getComputedStyle(img).opacity) || 1;
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, x, y, r.width, r.height);
    }
  }

  // 2. Dessiner les overlays éventuels (canvas)
  const overlayCanvases = Array.from(
    mapElement.querySelectorAll<HTMLCanvasElement>(
      ".leaflet-overlay-pane canvas",
    ),
  );
  for (const cvs of overlayCanvases) {
    const r = cvs.getBoundingClientRect();
    const x = r.left - mapRect.left;
    const y = r.top - mapRect.top;
    ctx.globalAlpha = parseFloat(window.getComputedStyle(cvs).opacity) || 1;
    ctx.drawImage(cvs, x, y, r.width, r.height);
  }

  // 3. Dessiner les ombres des marqueurs
  const shadows = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-shadow-pane img"),
  );
  for (const shadow of shadows) {
    if (shadow.complete && shadow.naturalWidth > 0) {
      const r = shadow.getBoundingClientRect();
      const x = r.left - mapRect.left;
      const y = r.top - mapRect.top;
      ctx.globalAlpha =
        parseFloat(window.getComputedStyle(shadow).opacity) || 1;
      ctx.drawImage(shadow, x, y, r.width, r.height);
    }
  }

  // 4. Dessiner les marqueurs (épingles)
  const markers = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-marker-pane img"),
  );
  for (const marker of markers) {
    if (marker.complete && marker.naturalWidth > 0) {
      const r = marker.getBoundingClientRect();
      const x = r.left - mapRect.left;
      const y = r.top - mapRect.top;
      ctx.globalAlpha =
        parseFloat(window.getComputedStyle(marker).opacity) || 1;
      ctx.drawImage(marker, x, y, r.width, r.height);
    }
  }

  // 5. Dessiner la mention d'attribution légale en bas à gauche de la carte
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
    const boxX = 0;
    const boxY = h - boxH;

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(attrText, 8, boxY + boxH / 2);
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
