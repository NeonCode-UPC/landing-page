

window.initNav = function() {
    const burger = document.getElementById("burger");
    const drawer = document.getElementById("drawer");
    const nav = document.getElementById("nav");
    const railItems = [...document.querySelectorAll(".rr-item")];
    const railFill = document.getElementById("railFill");
    const targets = railItems.map(a => document.querySelector(a.getAttribute("href")));

    if (burger && drawer) {
        const closeDrawer = () => {
            drawer.dataset.open = "false";
            burger.setAttribute("aria-expanded", "false");
        };
        burger.addEventListener("click", e => {
            e.stopPropagation();
            const open = drawer.dataset.open === "true";
            drawer.dataset.open = String(!open);
            burger.setAttribute("aria-expanded", String(!open));
        });
        drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", closeDrawer));
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") closeDrawer();
        });
    }

    function onScroll() {
        if (nav) nav.classList.toggle("is-stuck", window.scrollY > 10);
        const doc = document.documentElement;
        const pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
        const rail = document.getElementById("rail");
        if (railFill && rail) railFill.style.height = (pct * (rail.offsetHeight - 12)) + "px";

        let active = 0;
        targets.forEach((t, i) => {
            if (t && t.getBoundingClientRect().top <= window.innerHeight * 0.42) active = i;
        });
        railItems.forEach((a, i) => {
            a.setAttribute("aria-current", String(i === active));
            a.classList.toggle("passed", i < active);
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
};
