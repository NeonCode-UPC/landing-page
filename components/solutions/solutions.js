

window.initSolutions = function() {
  const fleetRows = [...document.querySelectorAll("[data-fleet]")];
  const flId = document.getElementById("flId");
  const flTemp = document.getElementById("flTemp");
  const flEta = document.getElementById("flEta");
  const flBox = document.getElementById("flBox");

  fleetRows.forEach(r => r.addEventListener("click", () => {
    try {
      const v = JSON.parse(r.dataset.fleet);
      fleetRows.forEach(o => o.setAttribute("aria-pressed", String(o === r)));
      if (flId) flId.textContent = v.id;
      if (flTemp) flTemp.textContent = v.temp;
      if (flEta) flEta.textContent = v.eta;
      if (flBox) flBox.textContent = v.box;
    } catch (e) {
      console.error(e);
    }
  }));
};
