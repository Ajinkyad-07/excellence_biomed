/* ============================================================
   products.js — Dynamic product gallery
   1. Fetches /data/products.json (the manifest)
   2. Renders product cards into #productGrid
   3. Optional: filter by category, free-text search by name/tag
   4. Opens a lightbox modal on card click
   Adding a new product = drop a new JPG in assets/images/products/
   and add one line to data/products.json. No code change required.
   ============================================================ */

(function () {
  "use strict";

  const MANIFEST_URL = "data/products.json";
  const PLACEHOLDER_ALT = "Excellence Biomed product visual aid";

  // ---------- DOM refs ----------
  const grid       = document.getElementById("productGrid");
  const emptyEl    = document.getElementById("productEmpty");
  const searchEl   = document.getElementById("productSearch");
  const filterEl   = document.getElementById("productCategory");
  const featuredEl = document.getElementById("featuredGrid");
  const modal      = document.getElementById("productModal");
  const modalImg   = document.getElementById("modalImage");
  const modalCat   = document.getElementById("modalCategory");
  const modalName  = document.getElementById("modalName");
  const modalDesc  = document.getElementById("modalDescription");
  const modalClose = document.getElementById("modalClose");
  const countEl    = document.getElementById("productCount");

  // No product UI on this page -> nothing to do
  if (!grid && !featuredEl) return;

  let allProducts = [];
  let activeCategory = "all";
  let activeQuery = "";

  // ---------- Render ----------
  function cardHTML(p) {
    const safeName = escapeHTML(p.name);
    const safeCat  = escapeHTML(p.category || "Product");
    const safeDesc = escapeHTML(p.description || "");
    const alt = `${safeName} — ${safeCat} — Excellence Biomed`;
    return `
      <article class="product-card" data-id="${p.id}" tabindex="0" role="button"
               aria-label="View ${safeName} details">
        <div class="thumb">
          <img src="${p.imageBase || 'assets/images/products/'}${p.image}"
               alt="${alt}" loading="lazy" decoding="async"
               onerror="this.closest('.thumb').classList.add('thumb--broken')">
        </div>
        <div class="body">
          <span class="category">${safeCat}</span>
          <h3>${safeName}</h3>
          <p class="desc">${safeDesc}</p>
        </div>
      </article>`;
  }

  function render(target, list) {
    if (!target) return;
    if (!list.length) {
      target.innerHTML = `
        <div class="empty-state">
          <p>No products match your search.</p>
        </div>`;
      return;
    }
    target.innerHTML = list.map(cardHTML).join("");
    target.querySelectorAll(".product-card").forEach((el) => {
      el.addEventListener("click", () => openModal(Number(el.dataset.id)));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(Number(el.dataset.id));
        }
      });
    });
  }

  function applyFilters() {
    const q = activeQuery.trim().toLowerCase();
    const filtered = allProducts.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (!q) return true;
      const hay = [p.name, p.category, p.description, ...(p.tags || [])]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });
    render(grid, filtered);
    if (countEl) countEl.textContent = `${filtered.length} of ${allProducts.length} products`;
  }

  // ---------- Modal ----------
  function openModal(id) {
    const p = allProducts.find((x) => x.id === id);
    if (!p || !modal) return;
    modalImg.src  = (p.imageBase || "assets/images/products/") + p.image;
    modalImg.alt  = `${p.name} — ${p.category} — Excellence Biomed`;
    modalCat.textContent   = p.category || "";
    modalName.textContent  = p.name || "";
    modalDesc.textContent  = p.description || "";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // Move focus to close for keyboard users
    setTimeout(() => modalClose && modalClose.focus(), 30);
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    modalClose && modalClose.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
  }

  // ---------- Filter wiring ----------
  if (searchEl) {
    searchEl.addEventListener("input", (e) => {
      activeQuery = e.target.value;
      applyFilters();
    });
  }
  if (filterEl) {
    filterEl.addEventListener("change", (e) => {
      activeCategory = e.target.value;
      applyFilters();
    });
  }

  // ---------- Init ----------
  function populateCategories(products) {
    if (!filterEl) return;
    const cats = Array.from(new Set(products.map((p) => p.category))).sort();
    filterEl.innerHTML = '<option value="all">All categories</option>' +
      cats.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  }

  async function init() {
    try {
      const res = await fetch(MANIFEST_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      // Resolve imageBase relative to current page
      const base = data.imageBase || "assets/images/products/";
      allProducts = (data.products || []).map((p) => ({ ...p, imageBase: base }));

      // Featured (homepage): first 4, or "featured" property if present
      if (featuredEl) {
        const featured = (data.featured && data.featured.length)
          ? data.featured.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean)
          : allProducts.slice(0, 4);
        render(featuredEl, featured);
      }

      // Full grid (products page)
      if (grid) {
        populateCategories(allProducts);
        applyFilters();
      }
    } catch (err) {
      console.error("Failed to load products manifest:", err);
      if (grid) grid.innerHTML = `
        <div class="empty-state">
          <p>Could not load products. Please refresh the page.</p>
        </div>`;
      if (featuredEl) featuredEl.innerHTML = "";
    }
  }

  // ---------- Utils ----------
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
