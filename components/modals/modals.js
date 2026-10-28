
window.initModals = function() {
  const WEBAPP_URL = "https://neoncode-upc.github.io/frontend/home";
  const dialogs = [...document.querySelectorAll("dialog.sheet")];

  function openDialog(id) {
    const dlg = document.getElementById(id);
    if (!dlg) return;
    dialogs.forEach(d => { if (d.open && d !== dlg) d.close(); });
    if (!dlg.open) dlg.showModal();
    const list = dlg.querySelector(".lg-list-wrap");
    if (list) {
      list.scrollTop = 0;
      const items = list.querySelectorAll("details");
      items.forEach((d, i) => { d.open = i === 0; });
    }
  }

  /* Abrir: cualquier elemento con data-open-dialog y los enlaces de login */
  document.querySelectorAll("[data-open-dialog]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      openDialog(el.dataset.openDialog);
    });
  });
  document.querySelectorAll(".js-login").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      openDialog("login-dialog");
    });
  });

  /* Cerrar: botón, enlaces marcados y clic en el fondo */
  dialogs.forEach(dlg => {
    dlg.querySelectorAll("[data-close-dialog]").forEach(el => el.addEventListener("click", () => dlg.close()));
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  });

  /* Login */
  const form = document.getElementById("loginForm");
  const pass = document.getElementById("login-pass");
  const eye = document.getElementById("loginEye");
  if (eye && pass) {
    eye.addEventListener("click", () => {
      const show = pass.type === "password";
      pass.type = show ? "text" : "password";
      eye.setAttribute("aria-pressed", String(show));
      const d = (window.I18N && window.I18N[window.getCurrentLang ? window.getCurrentLang() : "es"]) || {};
      eye.setAttribute("aria-label", show ? (d["login.hide"] || "Ocultar contraseña") : (d["login.show"] || "Mostrar contraseña"));
      const icon = eye.querySelector("i");
      if (icon) icon.className = show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
    });
  }
  if (form) {
    // La autenticación real ocurre dentro de la Web App: aquí solo llevamos al usuario hasta allá.
    form.addEventListener("submit", e => {
      e.preventDefault();
      window.location.href = WEBAPP_URL;
    });
  }
};
