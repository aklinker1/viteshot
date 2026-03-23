/** Main JS module for displaying the different screenshots */
import screenshots from "viteshot-virtual/screenshots";
import locales from "viteshot-virtual/locales";

declare const app: HTMLDivElement;

// Icons

const LOCALE_FLAGS: Record<string, string> = {
  be: "🇧🇪",
  br: "🇧🇷",
  de: "🇩🇪",
  en: "🇺🇸",
  en_gb: "🇬🇧",
  en_us: "🇺🇸",
  es: "🇪🇸",
  es_mx: "🇲🇽",
  fr: "🇫🇷",
  it: "🇮🇹",
  ja: "🇯🇵",
  pt: "🇧🇷",
  pt_br: "🇧🇷",
  ru: "🇷🇺",
  zh: "🇨🇳",
  zh_tw: "🇹🇼",
};

const HEROICONS_ARROW_UP_RIGHT_16_SOLID = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE --><path fill="currentColor" fill-rule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0" clip-rule="evenodd"/></svg>`;
const HEROICONS_SUN = `<svg class="light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0"/></svg>`;
const HEROICONS_MOON = `<svg class="dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.752 15.002A9.7 9.7 0 0 1 18 15.75A9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.75 9.75 0 0 0 3 11.25A9.75 9.75 0 0 0 12.75 21a9.75 9.75 0 0 0 9.002-5.998"/></svg>`;

// Language management

const LANGUAGE_STORAGE_KEY = "viteshot:language";

let currentLanguageId: string | undefined =
  getStoredLanguage() ?? locales[0]?.id;
function getStoredLanguage() {
  const prevId = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!prevId || !locales.some((l) => l.id === prevId)) return;

  return prevId;
}
function setLanguage(languageId: string): void {
  currentLanguageId = languageId;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, languageId);
}

// Theme

const THEME_STORAGE_KEY = "viteshot:theme";

let currentTheme: string = getStoredTheme() ?? "dark";

function getStoredTheme() {
  const prevTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (prevTheme !== "light" && prevTheme !== "dark") return;

  return prevTheme;
}
function toggleTheme(): void {
  const theme = currentTheme === "dark" ? "light" : "dark";

  currentTheme = theme;
  updateTheme();
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
function updateTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

// UI Rendering

type Child = string | HTMLElement | SVGElement | false | undefined | null;

interface ElementTagMap extends HTMLElementTagNameMap {
  svg: SVGElement;
}

function h<TTag extends keyof ElementTagMap>(
  tag: TTag,
  children: Child[],
): ElementTagMap[TTag];
function h<TTag extends keyof ElementTagMap>(
  tag: TTag,
  props: Partial<ElementTagMap[TTag]>,
  children?: Child[],
): ElementTagMap[TTag];
function h<TTag extends keyof ElementTagMap>(
  tag: TTag,
  arg1?: any,
  arg2?: any,
): ElementTagMap[TTag] {
  const hasProps =
    typeof arg1 === "object" &&
    !Array.isArray(arg1) &&
    !(arg1 instanceof HTMLElement);
  const props: Record<string, any> = hasProps ? arg1 : undefined;
  const children: Child[] = hasProps ? arg2 : arg1;

  const el = document.createElement(tag) as ElementTagMap[TTag];

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key in el) (el as any)[key] = value;
      else el.setAttribute(key, value);
    }
  }

  if (children) {
    for (const child of children) {
      if (child != null && child !== false) el.append(child);
    }
  }

  return el;
}

function svg(outerHtml: string): SVGElement {
  const temp = document.createElement("div");
  temp.innerHTML = outerHtml;
  return temp.firstElementChild as SVGElement;
}

function renderHeader() {
  app.append(
    h("div", { className: "header" }, [
      h("div", { className: "left" }, [
        h("h1", "ViteShot"),
        h(
          "a",
          { href: "https://github.com/aklinker1/viteshot", target: "_blank" },
          [h("span", ["Docs"]), svg(HEROICONS_ARROW_UP_RIGHT_16_SOLID)],
        ),
      ]),
      locales.length > 0 &&
        h(
          "select",
          {
            className: "language-select",
            onchange: (e) => {
              setLanguage((e.target as HTMLSelectElement).value);
              renderScreenshots();
            },
          },
          locales.map((l) =>
            h("option", { value: l.id, selected: currentLanguageId === l.id }, [
              `${LOCALE_FLAGS[l.language.replaceAll("-", "_").toLowerCase()] || "🌐"} ${l.language}`,
            ]),
          ),
        ),
      h("button", { className: "theme-toggle", onclick: toggleTheme }, [
        svg(HEROICONS_SUN),
        svg(HEROICONS_MOON),
      ]),
    ]),
  );
}

function renderScreenshots() {
  const existingUl = app.querySelector("& > ul");

  const newUl = h(
    "ul",
    screenshots.map((ss) =>
      h("li", { id: ss.id, className: "list-item" }, [
        h("h2", { className: "title-row" }, [
          h("a", { className: "name", href: `#${ss.id}` }, [ss.name]),
          ss.size && h("span", " "),
          ss.size && h("span", { className: "size" }, [ss.size]),
        ]),

        h("div", { className: "iframe-wrapper" }, [
          h(
            "iframe",
            {
              width: String(ss.width),
              height: String(ss.height),
              src: `/screenshot/${currentLanguageId ? encodeURIComponent(currentLanguageId) : "null"}/${encodeURIComponent(ss.id)}`,
            },
            [],
          ),
        ]),
      ]),
    ),
  );

  if (existingUl) {
    existingUl.replaceWith(newUl);
  } else {
    app.append(newUl);
  }
}

updateTheme();
renderHeader();
renderScreenshots();
