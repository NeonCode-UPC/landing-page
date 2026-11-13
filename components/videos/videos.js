

const VIDEO_IDS = {
  "video-producto": "X0bqgC3zW-4",
  "video-equipo": ""
};

const VIDEO_TITLES = {
  "video-producto": "Medical SmartBox — About the Product",
  "video-equipo": "Medical SmartBox — About the Team"
};

/** Checks whether a configured or data-video ID is a real YouTube ID (not a placeholder). */
function isConfiguredVideoId(id) {
  return Boolean(id && id.indexOf("_ID") === -1);
}

/** Builds a privacy-enhanced YouTube embed URL for the given video ID. */
function buildYouTubeEmbedUrl(id, autoplay) {
  const params = new URLSearchParams({ rel: "0" });
  if (autoplay) params.set("autoplay", "1");
  return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?" + params.toString();
}

/** Replaces a video container's poster with a responsive YouTube iframe. */
function mountYouTubeEmbed(frame, id, title, autoplay) {
  const ifr = document.createElement("iframe");
  ifr.src = buildYouTubeEmbedUrl(id, autoplay);
  ifr.title = title || "Medical SmartBox video";
  ifr.loading = autoplay ? "eager" : "lazy";
  // YouTube requires a Referer header on embeds to avoid Error 153.
  ifr.referrerPolicy = "strict-origin-when-cross-origin";
  ifr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  ifr.allowFullscreen = true;
  frame.innerHTML = "";
  frame.appendChild(ifr);
}

/** Shows the temporary "coming soon" notice on unconfigured video posters. */
function showSoonNotice(poster, clearPrevTimer) {
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
  if (clearPrevTimer) clearTimeout(clearPrevTimer);
  return setTimeout(() => note.classList.remove("on"), 2600);
}

/** Initializes all `.video-frame` sections with direct embeds or poster fallbacks. */
window.initVideos = function() {
  document.querySelectorAll(".video-frame").forEach(frame => {
    const poster = frame.querySelector(".video-poster");
    if (!poster) return;
    const section = frame.closest("section");
    const sectionId = section ? section.id : "";
    const configured = sectionId && VIDEO_IDS[sectionId];
    if (configured) frame.dataset.video = configured;

    const id = frame.dataset.video;
    const title = VIDEO_TITLES[sectionId] || "Medical SmartBox video";
    const isFileOrigin = window.location.protocol === "file:";

    // YouTube rejects iframe embeds loaded from file:// (null origin), so only auto-embed on http/https.
    if (isConfiguredVideoId(id) && !isFileOrigin) {
      mountYouTubeEmbed(frame, id, title, false);
      return;
    }

    let timer;
    const activate = () => {
      if (!isConfiguredVideoId(id)) {
        timer = showSoonNotice(poster, timer);
        return;
      }
      if (isFileOrigin) {
        window.open("https://youtu.be/" + encodeURIComponent(id), "_blank", "noopener,noreferrer");
        return;
      }
      mountYouTubeEmbed(frame, id, title, true);
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
