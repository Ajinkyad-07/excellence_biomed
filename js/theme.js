/* ============================================================
   theme.js — Light / dark toggle
   - Persists choice in localStorage
   - Respects prefers-color-scheme on first visit
   - Toggles data-theme on <html>
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "eb-theme"; // "light" | "dark"

  const root = document.documentElement;
  const btn  = document.querySelector("[data-theme-toggle]");

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
  function setStored(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch { /* private mode */ }
  }

  function systemTheme() {
    return window.matchMedia &&
           window.matchMedia("(prefers-color-scheme: dark)").matches
           ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      btn.setAttribute("title", btn.getAttribute("aria-label"));
    }
  }

  function init() {
    const stored = getStored();
    const theme  = stored === "light" || stored === "dark" ? stored : systemTheme();
    applyTheme(theme);

    if (btn) {
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        setStored(next);
      });
    }

    // React to system change ONLY if the user hasn't picked yet
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e) => {
        if (!getStored()) applyTheme(e.matches ? "dark" : "light");
      };
      mq.addEventListener ? mq.addEventListener("change", onChange)
                          : mq.addListener(onChange); // Safari < 14
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
