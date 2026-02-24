/** Main JS module for displaying the different screenshots */
import screenshots from "viteshot-virtual/screenshots";
import locales from "viteshot-virtual/locales";

declare const app: HTMLDivElement;

// Language management

const CURRENT_LANGUAGE_STORAGE_KEY = "viteshot:current-language";

let currentLanguageId: string | undefined = locales[0]?.language;

function restoreLanguage() {
  const oldId = localStorage.getItem(CURRENT_LANGUAGE_STORAGE_KEY);
  if (!oldId) return;

  const oldLocale = locales.find((l) => l.id === oldId);
  if (!oldLocale) return;

  currentLanguageId = oldId;
}

function setLanguage(languageId: string): void {
  currentLanguageId = languageId;
  localStorage.setItem(CURRENT_LANGUAGE_STORAGE_KEY, languageId);
}

// UI Rendering

function renderScreenshots() {
  app.innerHTML = "";

  const header = document.createElement("div");
  {
    header.className = "header";

    const h1 = document.createElement("h1");
    h1.textContent = "Dashboard";
    header.append(h1);

    if (locales.length > 0) {
      const select = document.createElement("select");

      for (const locale of locales) {
        const option = document.createElement("option");
        option.value = locale.id;
        option.textContent = locale.language;
        select.append(option);
      }

      if (currentLanguageId) select.value = currentLanguageId;

      select.addEventListener("change", () => {
        setLanguage(select.value);
        renderScreenshots();
      });

      header.append(select);
    }
  }
  app.append(header);

  const listItems = screenshots.map((screenshot) => {
    const li = document.createElement("li");
    li.id = screenshot.id;
    li.className = "list-item";

    const p = document.createElement("p");
    p.textContent = screenshot.name;
    li.append(p);

    const iframe = document.createElement("iframe");
    iframe.src = `/screenshot?sid=${encodeURIComponent(screenshot.id)}${currentLanguageId ? `&lid=${encodeURIComponent(currentLanguageId)}` : ""}&t=${Date.now()}`;
    if (screenshot.width) iframe.width = String(screenshot.width);
    if (screenshot.width) iframe.height = String(screenshot.height);
    li.append(iframe);

    return li;
  });

  app.append(...listItems);
}

restoreLanguage();
renderScreenshots();
