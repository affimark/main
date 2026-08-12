/* SIBT — shared site behavior: mobile nav, scroll reveal, contact form */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mainNav.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    mainNav.querySelectorAll(".has-sub > a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (window.innerWidth < 960) {
          e.preventDefault();
          link.parentElement.classList.toggle("is-open");
        }
      });
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 960 && !link.parentElement.classList.contains("has-sub")) {
          mainNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Contact form — client-side only (static hosting), no backend submission */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".form-field");
        if (!field.value.trim()) {
          valid = false;
          if (wrap) wrap.classList.add("has-error");
        } else if (wrap) {
          wrap.classList.remove("has-error");
        }
      });

      if (!status) return;
      status.classList.remove("is-success");
      if (valid) {
        status.textContent = status.getAttribute("data-success-text") || "Thank you — your inquiry has been received.";
        status.classList.add("is-visible", "is-success");
        form.reset();
      } else {
        status.textContent = status.getAttribute("data-error-text") || "Please complete the required fields.";
        status.classList.add("is-visible");
      }
    });
  }

  /* Current year in footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
