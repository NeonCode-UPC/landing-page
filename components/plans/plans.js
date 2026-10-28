
window.initPlans = function() {
  // "Contratar este plan" deja el plan elegido en el formulario antes de bajar a él.
  document.querySelectorAll(".plan-cta").forEach(a => {
    a.addEventListener("click", () => {
      const radio = document.querySelector('#contactForm input[name="plan"][value="' + a.dataset.plan + '"]');
      if (!radio) return;
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
};
