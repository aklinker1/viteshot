import screenshots from "@viteshot/screenshots";
import locales from "@viteshot/locales";

let selectedLanguage =
  localStorage.getItem("viteshot:locale") || locales[0]?.language;

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
        option.value = locale.language;
        option.textContent = locale.language;
        select.append(option);
      }

      select.value = selectedLanguage;
      select.addEventListener("change", () => {
        selectedLanguage = select.value;
        localStorage.setItem("viteshot:locale", select.value);
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
    iframe.src = `/screenshot/${screenshot.id}`;
    if (selectedLanguage) iframe.src += `?language=${selectedLanguage}`;
    iframe.width = screenshot.width;
    iframe.height = screenshot.height;
    li.append(iframe);

    return li;
  });

  app.append(...listItems);
}

renderScreenshots(screenshots);
