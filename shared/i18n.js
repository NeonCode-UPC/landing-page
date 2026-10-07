

const I18N = {
  es: {},
  en: {}
};

const TITLES = {
  es: "Medical SmartBox — Monitoreo y trazabilidad del transporte médico",
  en: "Medical SmartBox — Monitoring and traceability for medical transport"
};

let LANG = "en";
const langChangeListeners = [];

window.I18N = I18N;
window.TITLES = TITLES;

window.getCurrentLang = function() {
  return LANG;
};

window.registerI18n = function(bundle) {
  if (!bundle) return;
  if (bundle.es) Object.assign(I18N.es, bundle.es);
  if (bundle.en) Object.assign(I18N.en, bundle.en);
};

window.onLangChange = function(fn) {
  if (typeof fn === "function") {
    langChangeListeners.push(fn);
  }
};

window.applyLang = function(lang) {
  LANG = lang === "es" ? "es" : "en";
  const d = I18N[LANG] || {};

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (d[k] !== undefined) {
      el.innerHTML = d[k];
    }
  });

  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const k = el.getAttribute("data-i18n-ph");
    if (d[k] !== undefined) {
      el.placeholder = d[k];
    }
  });

  if (typeof window.refreshDd === "function") {
    window.refreshDd();
  }

  document.documentElement.lang = LANG;
  if (TITLES[LANG]) {
    document.title = TITLES[LANG];
  }

  document.querySelectorAll(".js-lang").forEach(t => {
    t.dataset.lang = LANG;
    t.setAttribute("aria-checked", String(LANG === "en"));
  });

  langChangeListeners.forEach(fn => {
    try { fn(LANG); } catch (e) { console.error(e); }
  });

  try {
    localStorage.setItem("msb-lang", LANG);
  } catch (e) {}
};

function initLangToggles() {
  document.querySelectorAll(".js-lang").forEach(t => {
    t.addEventListener("click", () => {
      window.applyLang(t.dataset.lang === "es" ? "en" : "es");
    });
    t.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") window.applyLang("en");
      if (e.key === "ArrowLeft") window.applyLang("es");
    });
  });
}

window.initI18n = function() {
  initLangToggles();
  let start = "en";
  try {
    start = localStorage.getItem("msb-lang") === "es" ? "es" : "en";
  } catch (e) {}
  window.applyLang(start);
};
