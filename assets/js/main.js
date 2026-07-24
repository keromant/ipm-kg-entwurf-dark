/* ================================================================
   JANA — main.js
   1) Scroll-Reveal (IntersectionObserver)
   2) Button-Sweep zuerst abspielen, dann erst Aktion (Link/Submit) — aus KoSta
   3) Mobile-Nav-Toggle
   4) Sticky-Header-Schatten
   Respektiert prefers-reduced-motion.
================================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0) GreenSock ScrollSmoother (weicher Scroll) ------ */
  /* Wrapper: #smooth-wrapper > #smooth-content. Fixierte Elemente (Header,
     Sticky-Call) liegen bewusst AUSSERHALB. Kein Effekt bei Reduced-Motion. */
  var smoother = null;
  if (!reduceMotion && window.gsap && window.ScrollTrigger && window.ScrollSmoother
      && document.getElementById('smooth-wrapper')) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.4,          /* Trägheit in Sekunden — ruhig, nicht überzogen */
      effects: true,        /* data-speed/data-lag-Parallax optional nutzbar */
      smoothTouch: 0.1,     /* auf Touch dezent (Usability für ältere Zielgruppe) */
      normalizeScroll: true
    });
  }

  /* ---------- 1) Scroll-Reveal --------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2) Button-Sweep vor Aktion ----------------------- */
  document.querySelectorAll('a.btn, button.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var isLink = btn.tagName === 'A';
      // Neue-Tab-/Modifier-Klicks nicht abfangen
      if (isLink && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1 || btn.target === '_blank')) return;
      // tel:/mailto: sofort durchlassen
      var href = isLink ? btn.getAttribute('href') : null;
      if (href && (href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0)) return;
      if (btn._acting) return;

      // Bei reduzierter Bewegung ohne Verzögerung agieren
      if (reduceMotion) return;

      e.preventDefault();
      btn._acting = true;
      btn.classList.add('is-activating');

      var finish = function () {
        if (isLink) {
          if (href && href.charAt(0) === '#') {
            if (href.length > 1) {
              var t = document.querySelector(href);
              if (t) {
                if (smoother) smoother.scrollTo(t, true, 'top ' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76) + 'px');
                else t.scrollIntoView({ behavior: 'smooth' });
              }
            }
            btn._acting = false; btn.classList.remove('is-activating');
          } else if (href) {
            window.location.href = href;
          } else {
            btn._acting = false; btn.classList.remove('is-activating');
          }
        } else {
          var form = btn.closest('form');
          btn._acting = false; btn.classList.remove('is-activating');
          if (form) {
            if (typeof form.requestSubmit === 'function') { form.requestSubmit(btn); }
            else { form.submit(); }
          }
        }
      };

      var fired = false;
      var once = function () { if (fired) return; fired = true; finish(); };
      btn.addEventListener('animationend', once, { once: true });
      setTimeout(once, 600); // Fallback gegen hängende Events
    });
  });

  /* ---------- 3) Mobile-Nav-Toggle ----------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Schließen beim Klick auf einen echten Link
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------- 4) Sticky-Header-Schatten ------------------------ */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 5) Footer-Jahr ------------------------------------ */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
