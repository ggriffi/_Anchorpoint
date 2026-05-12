async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return;
  el.innerHTML = await res.text();
}

function setActiveNav() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/index.html';
  const map = {
    '/':             'home',
    '/index.html':   'home',
    '/services.html':'services',
    '/about.html':   'about',
    '/blog.html':    'blog',
  };
  const key = map[path];
  if (!key) return;
  const link = document.querySelector(`.ap-nav a[data-nav="${key}"]`);
  if (link) link.classList.add('active');
}

(async function initSite() {
  await loadPartial('#site-header', '/partials/header.html');
  await loadPartial('#site-footer', '/partials/footer.html');
  setActiveNav();
})();

/* ── HEADER SCROLL STATE ──────────────────────────────── */
(function() {
  const header = document.querySelector('.ap-header');
  if (!header) return;
  const tick = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── SCROLL REVEAL ────────────────────────────────────── */
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* ── HERO EYEBROW TYPEWRITER ──────────────────────────── */
(function() {
  const el = document.querySelector('.eyebrow-type');
  if (!el) return;
  const text = el.dataset.text || '';
  let i = 0;
  function type() {
    el.textContent = text.slice(0, i);
    if (i < text.length) {
      i++;
      setTimeout(type, i === 1 ? 700 : 38 + Math.random() * 22);
    }
  }
  type();
})();

/* ── HERO PARALLAX (grid only — lets glow CSS animation run) */
(function() {
  const grid = document.querySelector('.ap-hero-section .grid-bg');
  if (!grid) return;
  window.addEventListener('scroll', function() {
    grid.style.transform = 'translateY(' + (window.scrollY * 0.07) + 'px)';
  }, { passive: true });
})();

/* ── H1 GLITCH (fires after hero entrance finishes) ───── */
(function() {
  const h1 = document.querySelector('.ap-h1');
  if (!h1) return;
  setTimeout(() => h1.classList.add('do-glitch'), 1400);
})();
