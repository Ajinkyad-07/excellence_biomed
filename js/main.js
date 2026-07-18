/* ============================================================
   main.js — Shared init: mobile nav, current year, misc
   ============================================================ */

(function () {
  "use strict";

  // Mobile nav toggle
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav    = document.getElementById("primaryNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close after clicking a link (mobile)
    nav.querySelectorAll(".nav-link").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Current year in footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Mark the active nav link based on the current filename
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-link[data-nav]").forEach((a) => {
    const target = (a.getAttribute("data-nav") || "").toLowerCase();
    if (target === path || (path === "" && target === "index.html")) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
})();
