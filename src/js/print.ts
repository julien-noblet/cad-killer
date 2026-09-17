/**
 * Capture et impression de la carte au format paysage
 *
 * @format
 */

export function captureMapToCanvas(mapElement: HTMLElement): HTMLCanvasElement {
  const mapRect = mapElement.getBoundingClientRect();
  const canvas = document.createElement("canvas");

  const w = mapRect.width;
  const h = mapRect.height;

  // Garantir le format paysage
  let canvasW: number;
  let canvasH: number;
  let offsetX = 0;
  let offsetY = 0;

  if (w >= h) {
    canvasW = Math.round(w);
    canvasH = Math.round(h);
  } else {
    // Écran en mode portrait : cadrage paysage proportionnel
    canvasW = Math.round(Math.max(w, h * 1.414));
    canvasH = Math.round(canvasW / 1.414);
    offsetX = Math.round((canvasW - w) / 2);
    offsetY = Math.round((canvasH - h) / 2);
  }

  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Fond neutre
  ctx.fillStyle = "#f8f4f0";
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 1. Dessiner les tuiles du fond de carte
  const tiles = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-tile-pane img"),
  );
  for (const img of tiles) {
    if (img.complete && img.naturalWidth > 0) {
      const r = img.getBoundingClientRect();
      const x = r.left - mapRect.left + offsetX;
      const y = r.top - mapRect.top + offsetY;
      const opacity = parseFloat(window.getComputedStyle(img).opacity) || 1;
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, x, y, r.width, r.height);
    }
  }

  // 2. Dessiner les canevas overlay éventuels
  const overlayCanvases = Array.from(
    mapElement.querySelectorAll<HTMLCanvasElement>(
      ".leaflet-overlay-pane canvas",
    ),
  );
  for (const cvs of overlayCanvases) {
    const r = cvs.getBoundingClientRect();
    const x = r.left - mapRect.left + offsetX;
    const y = r.top - mapRect.top + offsetY;
    ctx.globalAlpha = parseFloat(window.getComputedStyle(cvs).opacity) || 1;
    ctx.drawImage(cvs, x, y, r.width, r.height);
  }

  // 3. Dessiner les marqueurs (épingles)
  const markers = Array.from(
    mapElement.querySelectorAll<HTMLImageElement>(".leaflet-marker-pane img"),
  );
  for (const marker of markers) {
    if (marker.complete && marker.naturalWidth > 0) {
      const r = marker.getBoundingClientRect();
      const x = r.left - mapRect.left + offsetX;
      const y = r.top - mapRect.top + offsetY;
      ctx.globalAlpha =
        parseFloat(window.getComputedStyle(marker).opacity) || 1;
      ctx.drawImage(marker, x, y, r.width, r.height);
    }
  }

  ctx.globalAlpha = 1;
  return canvas;
}

let isGenerating = false;

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
    // Si canvas contaminé (CORS), on injecte directement le canvas
    printContainer.replaceChildren(canvas);
  }

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
    preparePrintImage();
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("is-printing-image");
  });

  // Méthodes accessibles pour les tests automatisés
  (window as any).triggerPrintMap = triggerPrint;
  (window as any).preparePrintImage = preparePrintImage;
}
