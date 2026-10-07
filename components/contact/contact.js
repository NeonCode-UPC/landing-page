

window.initContact = function() {
  const FORM_ENDPOINT = "";           // ej.: "https://formspree.io/f/xxxxxxx"
  const TO_EMAIL = "contacto@medicalsmartbox.com";
  const form = document.getElementById("contactForm");
  if (!form) return;

  const ok = document.getElementById("ctOk");
  const fail = document.getElementById("ctFail");
  const msg = document.getElementById("ct-msg");
  const count = document.getElementById("ctCount");
  const btn = document.getElementById("ctSubmit");
  const consent = document.getElementById("ct-consent");
  const cWrap = document.getElementById("ctCheckWrap");

  const rules = {
    "ct-name": v => v.trim().length >= 2,
    "ct-email": v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    "ct-topic": v => v !== "",
    "ct-msg": v => v.trim().length >= 10
  };

  const field = id => document.getElementById(id);
  function setErr(id, bad) {
    const el = field(id);
    if (!el) return;
    const wrap = el.closest(".f-field");
    if (wrap) wrap.classList.toggle("err", bad);
    el.setAttribute("aria-invalid", String(bad));
  }

  if (msg && count) {
    msg.addEventListener("input", () => {
      count.textContent = msg.value.length + " / 600";
    });
  }

  Object.keys(rules).forEach(id => {
    const el = field(id);
    if (!el) return;
    el.addEventListener("blur", () => setErr(id, !rules[id](el.value)));
    ["input", "change"].forEach(ev => el.addEventListener(ev, () => {
      const wrap = el.closest(".f-field");
      if (wrap && wrap.classList.contains("err")) setErr(id, !rules[id](el.value));
    }));
  });

  if (consent && cWrap) {
    consent.addEventListener("change", () => cWrap.classList.toggle("err", !consent.checked));
  }

  /* Dropdown personalizado */
  const sel = field("ct-topic");
  const dd = document.getElementById("ctDd");
  const ddBtn = document.getElementById("ctDdBtn");
  const ddVal = document.getElementById("ctDdVal");
  const ddList = document.getElementById("ctDdList");

  if (sel && dd && ddBtn && ddVal && ddList) {
    let active = -1;
    const items = () => [...ddList.children];

    function build() {
      ddList.innerHTML = "";
      [...sel.options].forEach((o, i) => {
        if (o.value === "") return;
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.id = "ctOpt" + i;
        li.dataset.value = o.value;
        li.setAttribute("aria-selected", String(sel.selectedIndex === i));
        const t = document.createElement("span");
        t.textContent = o.textContent;
        const ck = document.createElement("i");
        ck.className = "fa-solid fa-check";
        ck.setAttribute("aria-hidden", "true");
        li.append(t, ck);
        ddList.appendChild(li);
      });
      if (sel.options[sel.selectedIndex]) {
        ddVal.textContent = sel.options[sel.selectedIndex].textContent;
      }
      ddBtn.classList.toggle("is-empty", sel.value === "");
    }
    window.refreshDd = build;

    function setActive(i) {
      const it = items();
      if (!it.length) return;
      active = (i + it.length) % it.length;
      it.forEach((n, k) => n.classList.toggle("is-active", k === active));
      ddList.setAttribute("aria-activedescendant", it[active].id);
      it[active].scrollIntoView({ block: "nearest" });
    }

    function openDd() {
      dd.dataset.open = "true";
      ddBtn.setAttribute("aria-expanded", "true");
      const idx = items().findIndex(n => n.getAttribute("aria-selected") === "true");
      setActive(idx < 0 ? 0 : idx);
      ddList.focus({ preventScroll: true });
    }

    function closeDd(focusBtn) {
      dd.dataset.open = "false";
      ddBtn.setAttribute("aria-expanded", "false");
      if (focusBtn) ddBtn.focus();
    }

    function choose(li) {
      sel.value = li.dataset.value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      build();
      closeDd(true);
    }

    ddBtn.addEventListener("click", () => dd.dataset.open === "true" ? closeDd(false) : openDd());
    ddBtn.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openDd();
      }
    });
    ddBtn.addEventListener("blur", () => setTimeout(() => {
      if (dd.dataset.open !== "true" && document.activeElement !== ddList) {
        setErr("ct-topic", !rules["ct-topic"](sel.value));
      }
    }, 150));

    ddList.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Home") { e.preventDefault(); setActive(0); }
      else if (e.key === "End") { e.preventDefault(); setActive(-1); }
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const it = items()[active];
        if (it) choose(it);
      }
      else if (e.key === "Escape") { e.preventDefault(); closeDd(true); }
      else if (e.key === "Tab") { closeDd(false); }
    });

    ddList.addEventListener("click", e => {
      const li = e.target.closest("li");
      if (li) choose(li);
    });
    ddList.addEventListener("mousemove", e => {
      const li = e.target.closest("li");
      if (li) setActive(items().indexOf(li));
    });
    document.addEventListener("click", e => {
      if (dd.dataset.open === "true" && !dd.contains(e.target)) closeDd(false);
    });

    build();
  }
  const pl = document.getElementById("ctPrivacyLink");
  const privacyDialog = document.getElementById("privacy-dialog");
  if (pl && privacyDialog) {
    pl.addEventListener("click", e => {
      e.preventDefault();
      privacyDialog.showModal();
    });
  }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (fail) fail.classList.remove("on");
    let first = null;
    Object.keys(rules).forEach(id => {
      const bad = !rules[id](field(id).value);
      setErr(id, bad);
      if (bad && !first) first = id;
    });
    if (consent && !consent.checked) {
      if (cWrap) cWrap.classList.add("err");
      if (!first) first = "ct-consent";
    }
    if (first) {
      (first === "ct-topic" ? ddBtn : field(first)).focus();
      return;
    }
    if (form.website && form.website.value) return; // honeypot

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      organization: form.organization.value.trim(),
      phone: form.phone.value.trim(),
      topic: form.topic.value,
      message: form.message.value.trim()
    };

    const lang = window.getCurrentLang ? window.getCurrentLang() : "es";
    const d = (window.I18N && window.I18N[lang]) || {};

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
          body: JSON.stringify(data)
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
      } else {
        const topicText = form.topic.options[form.topic.selectedIndex] ? form.topic.options[form.topic.selectedIndex].text : "";
        const subj = encodeURIComponent("Contacto web — " + topicText);
        const body = encodeURIComponent("Nombre: " + data.name + "\nCorreo: " + data.email + "\nOrganización: " + (data.organization || "-") + "\nTeléfono: " + (data.phone || "-") + "\n\n" + data.message);
        location.href = "mailto:" + TO_EMAIL + "?subject=" + subj + "&body=" + body;
      }
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
        if (span) span.textContent = d["ct.send"] || "Enviar mensaje";
      }
    }
  });

  const ctAgain = document.getElementById("ctAgain");
  if (ctAgain) {
    ctAgain.addEventListener("click", () => {
      form.reset();
      if (window.refreshDd) window.refreshDd();
      if (count) count.textContent = "0 / 600";
      form.querySelectorAll(".err").forEach(n => n.classList.remove("err"));
      if (ok) ok.classList.remove("on");
      form.style.display = "";
      if (form.name) form.name.focus();
    });
  }

  /* Botón copiar correo */
  const copyBtn = document.getElementById("ctCopy");
  if (copyBtn) {
    let copyTimer;
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
      const lang = window.getCurrentLang ? window.getCurrentLang() : "es";
      const d = (window.I18N && window.I18N[lang]) || {};
      if (label) {
        label.removeAttribute("data-i18n");
        label.textContent = d["ct.copied"] || "Copiado";
      }
      if (icon) icon.className = "fa-solid fa-check";
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copyBtn.classList.remove("done");
        if (label) {
          label.setAttribute("data-i18n", "ct.copy");
          label.textContent = d["ct.copy"] || "Copiar";
        }
        if (icon) icon.className = "fa-regular fa-copy";
      }, 1800);
    });
  }
};
