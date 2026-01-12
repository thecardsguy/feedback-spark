// Lightweight runtime loader for vendor scripts placed in /public/vendor.
// We intentionally avoid importing some libraries as TS modules to prevent heavy type-checking issues.

declare global {
  interface Window {
    html2canvas?: (el: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    jspdf?: { jsPDF?: new (...args: any[]) => any };
    jsPDF?: new (...args: any[]) => any;
  }
}

const loaded = new Map<string, Promise<void>>();

function loadScript(src: string) {
  const existing = loaded.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const alreadyInDom = document.querySelector(`script[data-lovable-src="${src}"]`);
    if (alreadyInDom) {
      resolve();
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.lovableSrc = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });

  loaded.set(src, promise);
  return promise;
}

export async function getHtml2Canvas() {
  await loadScript('/vendor/html2canvas.min.js');
  if (!window.html2canvas) throw new Error('html2canvas not available after script load');
  return window.html2canvas;
}

export async function getJsPDF() {
  await loadScript('/vendor/jspdf.umd.min.js');
  const JsPdfCtor = window.jspdf?.jsPDF ?? window.jsPDF;
  if (!JsPdfCtor) throw new Error('jsPDF not available after script load');
  return JsPdfCtor;
}
