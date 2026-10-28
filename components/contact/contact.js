
window.initContact = function() {
  // Para recibir las solicitudes sin abrir el correo del usuario, pega aquí el endpoint
  // de un servicio de formularios (ej.: "https://formspree.io/f/xxxxxxx").
  const FORM_ENDPOINT = "";
  const TO_EMAIL = "contacto@medicalsmartbox.com";

  const form = document.getElementById("contactForm");
  if (!form) return;

  const ok = document.getElementById("ctOk");
  const fail = document.getElementById("ctFail");
  const msg = document.getElementById("ct-msg");
  const btn = document.getElementById("ctSubmit");
  const consent = document.getElementById("ct-consent");
  const cWrap = document.getElementById("ctCheckWrap");
  const summary = document.getElementById("ctSummary");

  const dict = () => (window.I18N && window.I18N[window.getCurrentLang ? window.getCurrentLang() : "es"]) || {};
  const radio = name => form.querySelector('input[name="' + name + '"]:checked');
  const val = id => document.getElementById(id).value;

  /* ---------- Validación ---------- */
  // Cada regla sabe qué campo revisar y cuál es su contenedor (.f-field).
  const rules = {
    plan:  { ok: () => !!radio("plan"),                                  focus: () => form.querySelector('input[name="plan"]') },
    qty:   { ok: () => { const n = Number(val("ct-qty")); return Number.isInteger(n) && n >= 1 && n <= 999; }, focus: () => document.getElementById("ct-qty") },
    org:   { ok: () => val("ct-org").trim().length >= 2,                 focus: () => document.getElementById("ct-org") },
    name:  { ok: () => val("ct-name").trim().length >= 2,                focus: () => document.getElementById("ct-name") },
    email: { ok: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("ct-email").trim()), focus: () => document.getElementById("ct-email") }
  };
  const order = ["plan", "qty", "org", "name", "email"];

  function setErr(key, bad) {
    const wrap = form.querySelector('[data-field="' + key + '"]');
    if (wrap) wrap.classList.toggle("err", bad);
  }
  function check(key) {
    const bad = !rules[key].ok();
    setErr(key, bad);
    return !bad;
  }

  // Revisa al salir del campo y limpia el error en cuanto se corrige.
  ["qty", "org", "name", "email"].forEach(key => {
    const el = rules[key].focus();
    if (!el) return;
    el.addEventListener("blur", () => check(key));
    el.addEventListener("input", () => {
      const wrap = form.querySelector('[data-field="' + key + '"]');
      if (wrap && wrap.classList.contains("err")) check(key);
    });
  });
  ["plan"].forEach(key => {
    form.querySelectorAll('input[name="' + key + '"]').forEach(r => r.addEventListener("change", () => check(key)));
  });
  if (consent && cWrap) {
    consent.addEventListener("change", () => cWrap.classList.toggle("err", !consent.checked));
  }

  /* ---------- Comentario opcional (oculto hasta que se pide) ---------- */
  const more = document.getElementById("ctMore");
  const msgWrap = document.getElementById("ctMsgWrap");
  if (more && msgWrap) {
    more.addEventListener("click", () => {
      const open = msgWrap.hidden;
      msgWrap.hidden = !open;
      more.setAttribute("aria-expanded", String(open));
      if (open) msg.focus();
    });
  }

  /* ---------- Estimado en vivo (valor referencial) ---------- */
  const PRICES = { small: 110, standard: 160 };
  const estVal = document.getElementById("ctEstVal");
  function updateEstimate() {
    if (!estVal) return;
    const d = dict();
    const p = radio("plan");
    const n = Math.max(1, Math.min(999, Number(val("ct-qty")) || 1));
    if (!p) { estVal.textContent = d["ct.est.none"] || "Elige un plan para ver tu estimado"; return; }
    if (p.value === "advice") { estVal.textContent = d["ct.est.advice"] || "Te asesoramos para elegir"; return; }
    const total = PRICES[p.value] * n;
    estVal.textContent = "S/ " + total.toLocaleString("es-PE") + " " + (d["ct.est.month"] || "al mes");
  }
  form.querySelectorAll('input[name="plan"]').forEach(r => r.addEventListener("change", updateEstimate));
  document.getElementById("ct-qty").addEventListener("input", updateEstimate);
  updateEstimate();

  /* ---------- Selector de cantidad (− / +) ---------- */
  form.querySelectorAll(".f-num button").forEach(b => {
    b.addEventListener("click", () => {
      const input = document.getElementById(b.dataset.target);
      if (!input) return;
      const min = Number(input.min || 0);
      const max = Number(input.max || 999);
      const next = (Number(input.value) || 0) + Number(b.dataset.step);
      input.value = Math.min(max, Math.max(min, next));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });
  document.getElementById("ct-qty").addEventListener("change", updateEstimate);

  /* ---------- Envío ---------- */
  const planNames = { small: "Small Box (5 L)", standard: "Standard Box (20 L)", advice: "Necesita asesoría para elegir" };

  function readData() {
    return {
      plan: radio("plan").value,
      qty: Number(val("ct-qty")),
      organization: val("ct-org").trim(),
      name: val("ct-name").trim(),
      email: val("ct-email").trim(),
      message: msg.value.trim()
    };
  }

  function renderSummary(data) {
    if (!summary || !data) return;
    const d = dict();
    const planLabel = { small: d["ct.pl1"], standard: d["ct.pl2"], advice: d["ct.pl3"] }[data.plan];
    const rows = [
      [d["ct.sum.plan"], planLabel],
      [d["ct.sum.qty"], String(data.qty)],
      [d["ct.sum.org"], data.organization],
      [d["ct.sum.mail"], data.email]
    ];
    summary.innerHTML = "";
    rows.forEach(r => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = r[0] || "";
      dd.textContent = r[1] || "";
      row.append(dt, dd);
      summary.appendChild(row);
    });
  }

  let lastSent = null;
  if (window.onLangChange) window.onLangChange(() => { updateEstimate(); if (ok && ok.classList.contains("on")) renderSummary(lastSent); });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (fail) fail.classList.remove("on");

    let first = null;
    order.forEach(key => { if (!check(key) && !first) first = key; });
    if (consent && !consent.checked) {
      if (cWrap) cWrap.classList.add("err");
      if (!first) first = "consent";
    }
    if (first) {
      const target = first === "consent" ? consent : rules[first].focus();
      if (target) {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (form.website && form.website.value) return; // honeypot

    const data = readData();
    const d = dict();
    if (btn) {
      btn.disabled = true;
      const span = btn.querySelector("span");
      if (span) span.textContent = d["ct.sending"] || "Enviando...";
    }

    try {
      if (FORM_ENDPOINT) {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(Object.assign({}, data, { planName: planNames[data.plan] }))
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
      } else {
        const subj = encodeURIComponent("Solicitud de contratación — " + data.organization + " — " + planNames[data.plan]);
        const lines = [
          "SOLICITUD DE CONTRATACIÓN",
          "",
          "Plan: " + planNames[data.plan],
          "SmartBoxes: " + data.qty,
          "Organización: " + data.organization,
          "Contacto: " + data.name,
          "Correo: " + data.email,
          "",
          "Comentarios: " + (data.message || "-")
        ];
        location.href = "mailto:" + TO_EMAIL + "?subject=" + subj + "&body=" + encodeURIComponent(lines.join("\n"));
      }
      lastSent = data;
      renderSummary(data);
      form.style.display = "none";
      if (ok) {
        ok.classList.add("on");
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      if (fail) {
        fail.classList.add("on");
        fail.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        const span = btn.querySelector("span");
        if (span) span.textContent = dict()["ct.send"] || "Solicitar contratación";
      }
    }
  });

  const again = document.getElementById("ctAgain");
  if (again) {
    again.addEventListener("click", () => {
      form.reset();
      setTimeout(updateEstimate, 0);
      if (more && msgWrap) { msgWrap.hidden = true; more.setAttribute("aria-expanded", "false"); }
      updateEstimate();
      form.querySelectorAll(".err").forEach(n => n.classList.remove("err"));
      if (ok) ok.classList.remove("on");
      form.style.display = "";
      const first = form.querySelector('input[name="plan"]');
      if (first) first.focus();
    });
  }

  /* ---------- Copiar correo ---------- */
  const copyBtn = document.getElementById("ctCopy");
  if (copyBtn) {
    let timer;
    copyBtn.addEventListener("click", async () => {
      const text = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        ta.remove();
      }
      const label = copyBtn.querySelector("span");
      const icon = copyBtn.querySelector("i");
      copyBtn.classList.add("done");
      if (label) {
        label.removeAttribute("data-i18n");
        label.textContent = dict()["ct.copied"] || "Copiado";
      }
      if (icon) icon.className = "fa-solid fa-check";
      clearTimeout(timer);
      timer = setTimeout(() => {
        copyBtn.classList.remove("done");
        if (label) {
          label.setAttribute("data-i18n", "ct.copy");
          label.textContent = dict()["ct.copy"] || "Copiar";
        }
        if (icon) icon.className = "fa-regular fa-copy";
      }, 1800);
    });
  }
};
