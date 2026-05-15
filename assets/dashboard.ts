/** Main JS module for displaying the different screenshots */
import screenshots from "viteshot-virtual/screenshots";
import locales from "viteshot-virtual/locales";

// ── Icons ──────────────────────────────────────────────────────────────────

const LOCALE_FLAGS: Record<string, string> = {
  be: "🇧🇪", br: "🇧🇷", de: "🇩🇪", en: "🇺🇸", en_gb: "🇬🇧",
  en_us: "🇺🇸", es: "🇪🇸", es_mx: "🇲🇽", fr: "🇫🇷", it: "🇮🇹",
  ja: "🇯🇵", pt: "🇧🇷", pt_br: "🇧🇷", ru: "🇷🇺", zh: "🇨🇳", zh_tw: "🇹🇼",
};

const ICON_CAMERA = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/></svg>`;
const ICON_ARROW_OUT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0" clip-rule="evenodd"/></svg>`;
const ICON_EXPAND = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M1.75 2.5a.75.75 0 0 0 0 1.5h1.69L.97 6.47a.75.75 0 0 0 1.06 1.06L4.5 5.06v1.69a.75.75 0 0 0 1.5 0V2.5H1.75ZM10 2.5a.75.75 0 0 0 0 1.5h1.69l-2.47 2.47a.75.75 0 1 0 1.06 1.06L12.75 5.06v1.69a.75.75 0 0 0 1.5 0V2.5H10ZM2.5 10a.75.75 0 0 0-1.5 0v3.75H4.75a.75.75 0 0 0 0-1.5H3.06l2.47-2.47a.75.75 0 0 0-1.06-1.06L2 11.19V10ZM10.75 12.25a.75.75 0 0 0 1.5 0V10a.75.75 0 0 0-1.5 0v1.19l-2.47-2.47a.75.75 0 1 0-1.06 1.06l2.47 2.47H10a.75.75 0 0 0 0 1.5h3.75V10a.75.75 0 0 0-1.5 0v1.19Z" clip-rule="evenodd"/></svg>`;
const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>`;
const ICON_SUN = `<svg class="light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0"/></svg>`;
const ICON_MOON = `<svg class="dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.752 15.002A9.7 9.7 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.75 9.75 0 0 0 3 11.25 9.75 9.75 0 0 0 12.75 21a9.75 9.75 0 0 0 9.002-5.998"/></svg>`;

// ── Language ───────────────────────────────────────────────────────────────

const LANGUAGE_KEY = "viteshot:language";
let currentLanguageId: string | undefined = getStoredLanguage() ?? locales[0]?.id;

function getStoredLanguage() {
  const id = localStorage.getItem(LANGUAGE_KEY);
  if (!id || !locales.some((l) => l.id === id)) return;
  return id;
}
function setLanguage(id: string) {
  currentLanguageId = id;
  localStorage.setItem(LANGUAGE_KEY, id);
}

// ── Theme ──────────────────────────────────────────────────────────────────

const THEME_KEY = "viteshot:theme";
let currentTheme: string = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
}
function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme();
}

// ── Utils ──────────────────────────────────────────────────────────────────

type Child = string | HTMLElement | SVGElement | false | null | undefined;

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Partial<HTMLElementTagNameMap[K]> & Record<string, any>,
  children?: Child[],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (k in el) (el as any)[k] = v;
      else el.setAttribute(k, v);
    }
  }
  if (children) {
    for (const c of children) {
      if (c != null && c !== false) el.append(c);
    }
  }
  return el;
}

function svgNode(raw: string): SVGElement {
  const tmp = document.createElement("div");
  tmp.innerHTML = raw;
  return tmp.firstElementChild as SVGElement;
}

function iframeUrl(ssId: string) {
  const lang = currentLanguageId ? encodeURIComponent(currentLanguageId) : "null";
  return `/screenshot/${lang}/${encodeURIComponent(ssId)}.html`;
}

// ── Render Header ──────────────────────────────────────────────────────────

function renderHeader(app: HTMLElement) {
  const header = h("header", { className: "header" }, [
    h("div", { className: "left" }, [
      h("div", { className: "header-logo" }, [
        svgNode(ICON_CAMERA),
        h("h1", {}, ["ViteShot"]),
      ]),
      h(
        "a",
        {
          className: "header-docs-link",
          href: "https://github.com/aklinker1/viteshot",
          target: "_blank",
        },
        ["Docs", svgNode(ICON_ARROW_OUT)],
      ),
    ]),
    h("div", { className: "header-right" }, [
      locales.length > 0
        ? h(
            "select",
            {
              className: "language-select",
              onchange: (e: Event) => {
                setLanguage((e.target as HTMLSelectElement).value);
                refreshGrid();
              },
            },
            locales.map((l) =>
              h("option", { value: l.id, selected: currentLanguageId === l.id }, [
                `${LOCALE_FLAGS[l.language.replaceAll("-", "_").toLowerCase()] ?? "🌐"} ${l.language}`,
              ]),
            ),
          )
        : null,
      h("button", { className: "theme-toggle", onclick: toggleTheme }, [
        svgNode(ICON_SUN),
        svgNode(ICON_MOON),
      ]),
    ]),
  ]);

  app.append(header);
}

// ── Render Grid ────────────────────────────────────────────────────────────

const PREVIEW_HEIGHT = 160;

function scaleIframe(wrapper: HTMLElement, iframe: HTMLIFrameElement, naturalWidth: number, naturalHeight: number) {
  const ww = wrapper.clientWidth || 300;
  const scale = ww / naturalWidth;
  const scaledHeight = naturalHeight * scale;
  iframe.style.transform = `scale(${scale})`;
  iframe.style.width = `${naturalWidth}px`;
  iframe.style.height = `${naturalHeight}px`;
  iframe.style.left = "0";
  // vertically center if scaled height is less than fixed preview height
  const offsetY = scaledHeight < PREVIEW_HEIGHT ? (PREVIEW_HEIGHT - scaledHeight) / 2 : 0;
  iframe.style.top = `${offsetY}px`;
}

let grid: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;

function buildGrid(): HTMLElement {
  if (resizeObserver) resizeObserver.disconnect();
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const wrapper = entry.target as HTMLElement;
      const iframe = wrapper.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) continue;
      const w = Number(iframe.getAttribute("data-w"));
      const hh = Number(iframe.getAttribute("data-h"));
      if (w && hh) scaleIframe(wrapper, iframe, w, hh);
    }
  });

  const newGrid = h("div", { className: "screenshots-grid" });

  for (const ss of screenshots) {
    const iframe = h("iframe", {
      src: iframeUrl(ss.id),
      width: String(ss.width),
      height: String(ss.height),
    });
    iframe.setAttribute("data-w", String(ss.width));
    iframe.setAttribute("data-h", String(ss.height));

    const expandBtn = h("button", { className: "card-preview-expand",
      onclick: (e: MouseEvent) => { e.stopPropagation(); openModal(ss.id, ss.name, ss.size, ss.width, ss.height); }
    }, [svgNode(ICON_EXPAND), "Preview"]);

    const previewWrapper = h("div", { className: "card-preview" }, [iframe, expandBtn]);

    const card = h("div", { id: ss.id, className: "card",
      onclick: () => openModal(ss.id, ss.name, ss.size, ss.width, ss.height)
    }, [
      previewWrapper,
      h("div", { className: "card-footer" }, [
        h("div", { className: "card-name-row" }, [
          h("a", { className: "card-name", href: `#${ss.id}` }, [ss.name]),
          ss.size ? h("span", { className: "card-size-badge" }, [ss.size]) : null,
        ]),
      ]),
    ]);

    newGrid.append(card);
    resizeObserver.observe(previewWrapper);

    // initial scale after paint
    requestAnimationFrame(() => {
      scaleIframe(previewWrapper, iframe, ss.width, ss.height);
    });
  }

  return newGrid;
}

function refreshGrid() {
  const newGrid = buildGrid();
  if (grid?.parentElement) {
    grid.parentElement.replaceChild(newGrid, grid);
  }
  grid = newGrid;
}

// ── Modal ──────────────────────────────────────────────────────────────────

let modalOverlay: HTMLElement | null = null;

function openModal(ssId: string, name: string, size: string | undefined | null, width: number, height: number) {
  if (modalOverlay) closeModal();

  const overlay = h("div", { className: "modal-overlay" });

  const box = h("div", { className: "modal-box" }, [
    h("div", { className: "modal-header" }, [
      h("span", { className: "modal-title" }, [name]),
      h("div", { className: "modal-meta" }, [
        size ? h("span", { className: "card-size-badge" }, [size]) : null,
        h("button", { className: "modal-close", onclick: closeModal }, [svgNode(ICON_CLOSE)]),
      ]),
    ]),
    h("div", { className: "modal-iframe-wrapper" }, [
      h("iframe", { src: iframeUrl(ssId), width: String(width), height: String(height) }),
    ]),
  ]);

  overlay.append(box);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.body.append(overlay);
  modalOverlay = overlay;

  requestAnimationFrame(() => overlay.classList.add("visible"));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { closeModal(); document.removeEventListener("keydown", onKey); }
  };
  document.addEventListener("keydown", onKey);
}

function closeModal() {
  if (!modalOverlay) return;
  const el = modalOverlay;
  modalOverlay = null;
  el.classList.remove("visible");
  el.addEventListener("transitionend", () => el.remove(), { once: true });
}

// ── Boot ───────────────────────────────────────────────────────────────────

const app = document.getElementById("app")!;
applyTheme();
renderHeader(app);

const body = h("main", { className: "app-body" }, [
  h("div", { className: "page-intro" }, [
    h("span", { className: "page-intro-title" }, ["Screenshots"]),
    h("span", { className: "page-intro-count" }, [`${screenshots.length} design${screenshots.length !== 1 ? "s" : ""}`]),
  ]),
]);

grid = buildGrid();
body.append(grid);
app.append(body);
