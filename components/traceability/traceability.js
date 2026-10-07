

let currentEvent = 3;

function renderEvent(i) {
  const lang = window.getCurrentLang ? window.getCurrentLang() : "es";
  const events = window.TRACEABILITY_EVENTS || {};
  const list = events[lang] || [];
  const ev = list[i];
  if (!ev) return;

  const evTitle = document.getElementById("evTitle");
  const evDesc = document.getElementById("evDesc");
  const evTime = document.getElementById("evTime");
  const evLoc = document.getElementById("evLoc");
  const evTemp = document.getElementById("evTemp");

  if (evTitle) evTitle.textContent = ev.t;
  if (evDesc) evDesc.textContent = ev.d;
  if (evTime) evTime.textContent = ev.time;
  if (evLoc) evLoc.textContent = ev.loc;
  if (evTemp) evTemp.textContent = ev.temp;

  const steps = [...document.querySelectorAll(".step")];
  steps.forEach((s, n) => s.setAttribute("aria-selected", String(n === i)));
}

window.initTraceability = function() {
  const steps = [...document.querySelectorAll(".step")];
  steps.forEach(s => s.addEventListener("click", () => {
    currentEvent = Number(s.dataset.ev);
    renderEvent(currentEvent);
  }));
  renderEvent(currentEvent);
};

if (window.onLangChange) {
  window.onLangChange(() => {
    renderEvent(currentEvent);
  });
}
