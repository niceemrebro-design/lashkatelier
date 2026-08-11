/* Lash Katelier — Interaktion.
   Kein Framework, keine externen Requests, kein Tracking. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --- Farbschema ------------------------------------------------------- */

  var themeToggle = document.getElementById("themeToggle");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("lk-theme", next);
      } catch (e) {
        /* Speichern nicht möglich — Umschalten funktioniert trotzdem. */
      }
    });
  }

  /* --- Kopfzeile: Linie erst nach dem Scrollen -------------------------- */

  var header = document.getElementById("siteHeader");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Mobiles Menü ----------------------------------------------------- */

  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Menü schliessen" : "Menü öffnen");
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* --- Sanftes Einblenden beim Scrollen --------------------------------- */

  var revealables = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* --- Aktiver Navigationspunkt ----------------------------------------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Map();

    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        var activeId = null;
        var best = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > best) {
            best = ratio;
            activeId = id;
          }
        });

        navLinks.forEach(function (link) {
          link.classList.toggle(
            "is-active",
            activeId !== null && link.getAttribute("href") === "#" + activeId
          );
        });
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* --- Bildrahmen ohne Foto sauber auffangen ---------------------------- */

  document.querySelectorAll(".frame img").forEach(function (img) {
    var markEmpty = function () {
      var frame = img.closest(".frame");
      if (frame) frame.classList.add("is-empty");
    };

    img.addEventListener("error", markEmpty);
    if (img.complete && img.naturalWidth === 0) markEmpty();
  });

  /* --- Anfrageformular --------------------------------------------------
     Statische Seite ohne Server: Die Anfrage wird als vorbereitete E-Mail
     im Mailprogramm geöffnet. Wer stattdessen einen Formulardienst nutzt,
     trägt die Adresse unten bei FORM_ENDPOINT ein.                        */

  var FORM_ENDPOINT = ""; /* z. B. "https://formspree.io/f/xxxxxxxx" */
  var MAIL_TO = "hallo@lashkatelier.de";

  var form = document.getElementById("bookingForm");
  var status = document.getElementById("formStatus");

  function say(text) {
    if (status) status.textContent = text;
  }

  if (form) {
    if (FORM_ENDPOINT) {
      form.setAttribute("action", FORM_ENDPOINT);
      form.setAttribute("method", "post");
    }

    form.addEventListener("submit", function (event) {
      if (FORM_ENDPOINT) return; /* echter Endpunkt: normal abschicken */

      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        say("Bitte fülle Name, E-Mail und die Einwilligung aus.");
        return;
      }

      var data = new FormData(form);
      var value = function (key) {
        return String(data.get(key) || "").trim();
      };

      var subject = "Terminanfrage — " + (value("service") || "Lash Katelier");
      var body = [
        "Name: " + value("name"),
        "E-Mail: " + value("email"),
        "Telefon: " + (value("phone") || "—"),
        "Leistung: " + value("service"),
        "Wunschtermin: " + (value("wunsch") || "—"),
        "",
        "Nachricht:",
        value("message") || "—",
      ].join("\n");

      window.location.href =
        "mailto:" +
        MAIL_TO +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      say("Dein E-Mail-Programm öffnet sich mit der fertigen Anfrage.");
    });
  }

  /* --- Jahr in der Fusszeile -------------------------------------------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
