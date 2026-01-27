async function loadPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;

    el.innerHTML = await res.text();
}

function setActiveNav() {
    const path = window.location.pathname.replace(/\/+$/, "") || "/index.html";

    const map = {
        "/": "home",
        "/index.html": "home",
        "/services.html": "services",
        "/about.html": "about",
    };

    const key = map[path];
    if (!key) return;

    const link = document.querySelector(`.nav a[data-nav="${key}"]`);
    if (link) link.classList.add("active");
}

(async function initSite() {
    await loadPartial("#site-header", "/partials/header.html");
    await loadPartial("#site-footer", "/partials/footer.html");
    setActiveNav();
})();
