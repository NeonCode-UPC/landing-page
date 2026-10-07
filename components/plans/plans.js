

window.initPlans = function() {
  document.querySelectorAll(".plan-cta").forEach(a => {
    a.addEventListener("click", () => {
      const sel = document.getElementById("ct-topic");
      if (sel) {
        sel.value = "quote";
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        if (window.refreshDd) window.refreshDd();
      }
      const msg = document.getElementById("ct-msg");
      if (msg && !msg.value.trim()) {
        const lang = window.getCurrentLang ? window.getCurrentLang() : "es";
        const d = (window.I18N && window.I18N[lang]) || {};
        const name = lang === "en" ? a.dataset.planEn : a.dataset.plan;
        const prefill = d["pl.prefill"] || "Me interesa el plan {plan}. ";
        msg.value = prefill.replace("{plan}", name);
        msg.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  });
};
