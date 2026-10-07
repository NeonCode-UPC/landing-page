
document.addEventListener("DOMContentLoaded", async function () {
  const includes = Array.from(document.querySelectorAll("[data-include]"));

  await Promise.all(includes.map(async function (placeholder) {
    const file = placeholder.getAttribute("data-include");
    let html = "";

    try {
      const response = await fetch(file);
      if (response.ok) html = await response.text();
    } catch (error) {
    }

    if (!html && window.COMPONENT_TEMPLATES) html = window.COMPONENT_TEMPLATES[file] || "";
    if (!html) {
      console.error("No se pudo cargar el componente: " + file);
      return;
    }

    const content = document.createElement("div");
    content.innerHTML = html.trim();
    if (content.childElementCount === 1) placeholder.replaceWith(content.firstElementChild);
    else placeholder.replaceWith(...content.childNodes);
  }));

  if (window.initializeMedicalSmartBox) window.initializeMedicalSmartBox();
});