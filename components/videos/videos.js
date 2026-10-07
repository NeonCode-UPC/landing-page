

const VIDEO_IDS = {
  "video-producto": "",   
  "video-equipo": ""      
};

window.initVideos = function() {
  document.querySelectorAll(".video-frame").forEach(frame => {
    const poster = frame.querySelector(".video-poster");
    if (!poster) return;
    const section = frame.closest("section");
    const configured = section && VIDEO_IDS[section.id];
    if (configured) frame.dataset.video = configured;
    let timer;

    const activate = () => {
      const id = frame.dataset.video;
      if (!id || id.indexOf("_ID") > -1) {
        let note = poster.querySelector(".video-soon");
        if (!note) {
          note = document.createElement("span");
          note.className = "video-soon";
          note.setAttribute("role", "status");
          poster.appendChild(note);
        }
        const lang = window.getCurrentLang ? window.getCurrentLang() : "es";
        const d = (window.I18N && window.I18N[lang]) || {};
        note.textContent = d["vp.soon"] || "El video se publicará en YouTube muy pronto.";
        note.classList.add("on");
        clearTimeout(timer);
        timer = setTimeout(() => note.classList.remove("on"), 2600);
        return;
      }
      const ifr = document.createElement("iframe");
      ifr.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
      ifr.title = "Medical SmartBox video";
      ifr.allow = "autoplay; encrypted-media; picture-in-picture";
      ifr.allowFullscreen = true;
      frame.innerHTML = "";
      frame.appendChild(ifr);
    };

    poster.addEventListener("click", activate);
    poster.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
};
