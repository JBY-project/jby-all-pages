/* =====================================================================
   Inventory — what the server used to do, done in the browser.

   The deployed catalogue filters, sorts and pages on the server: every panel
   ends in updateUrlAndReload(), which sets query parameters and reloads. The
   prototype has no server, so this file:

     - answers the two endpoints yacht_catalog.js fetches (locations and
       make/model suggestions) out of listings.js;
     - replaces updateUrlAndReload() with one that changes the URL and
       re-renders in place — the parameter names are the deployed page's own,
       so a link with ?vesselCondition=new&minLength=40 behaves the same here;
     - renders the grid, the count and the pagination, in the deployed page's
       markup, so the stylesheet needs no changes at all.

   Loaded BEFORE yacht_catalog.js: the fetch shim has to be in place before its
   DOMContentLoaded handler asks for the locations. Everything else waits for
   that handler to have run.
   ===================================================================== */
(function () {
  "use strict";

  var PER_PAGE = 12;
  var listings = window.JBY_LISTINGS || [];

  /* ---------- the two endpoints ---------- */
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  function asJson(obj) {
    return Promise.resolve(new Response(JSON.stringify(obj), {
      status: 200, headers: { "Content-Type": "application/json" }
    }));
  }
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    if (url.indexOf("/yachts/locations") === 0) {
      return asJson({ locations: window.JBY_LOCATIONS || [] });
    }
    if (url.indexOf("/yachts/make-model-suggestions") === 0) {
      var q = decodeURIComponent((url.split("q=")[1] || "")).toLowerCase().trim();
      var items = (window.JBY_SUGGESTIONS || []).filter(function (s) {
        return !q || s.label.toLowerCase().indexOf(q) >= 0;
      }).slice(0, 25);
      return asJson({ items: items });
    }
    return realFetch ? realFetch(input, init) : Promise.reject(new Error("no fetch"));
  };

  /* ---------- state, read from the URL the way the deployed page reads it ---------- */
  function params() { return new URLSearchParams(window.location.search); }
  function num(v) { var n = parseFloat(String(v || "").replace(/[^\d.]/g, "")); return isNaN(n) ? null : n; }
  function list(v) { return v ? v.split(",").filter(Boolean) : []; }

  function filtered() {
    var p = params();
    var condition = p.get("vesselCondition");
    var minPrice = num(p.get("minPrice")), maxPrice = num(p.get("maxPrice"));
    var minLength = num(p.get("minLength")), maxLength = num(p.get("maxLength"));
    var city = p.get("locationCity"), country = p.get("locationCountry");
    var search = (p.get("search") || "").toLowerCase().trim();
    var makeIds = list(p.get("makeIds")), modelIds = list(p.get("modelIds"));

    return listings.filter(function (v) {
      if (condition && v.condition !== condition) return false;
      /* Contact for Price has no number to compare; a price filter excludes it,
         as it does on the deployed page. */
      if ((minPrice !== null || maxPrice !== null)) {
        if (v.priceValue === null) return false;
        if (minPrice !== null && v.priceValue < minPrice) return false;
        if (maxPrice !== null && v.priceValue > maxPrice) return false;
      }
      if (minLength !== null && !(v.length >= minLength)) return false;
      if (maxLength !== null && !(v.length <= maxLength)) return false;
      if (city && v.city !== city) return false;
      if (country && v.country !== country) return false;
      if (modelIds.length && modelIds.indexOf("model:" + v.make + "|" + v.model) < 0) return false;
      if (!modelIds.length && makeIds.length && makeIds.indexOf("make:" + v.make) < 0) return false;
      if (search && (v.name + " " + v.location).toLowerCase().indexOf(search) < 0) return false;
      return true;
    });
  }

  function sorted(rows) {
    var p = params();
    var by = p.get("orderBy") || "Date Added";
    var dir = (p.get("order") || "DESC").toUpperCase() === "ASC" ? 1 : -1;
    var key = {
      "Price": function (v) { return v.priceValue === null ? -1 : v.priceValue; },
      "Year": function (v) { return v.year || 0; },
      "Length": function (v) { return v.length || 0; },
      "Date Added": function (v) { return v.added; }
    }[by] || function (v) { return v.added; };
    return rows.slice().sort(function (a, b) {
      var x = key(a), y = key(b);
      return x === y ? 0 : (x > y ? dir : -dir);
    });
  }

  /* ---------- the card, as the deployed page writes it ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function cardHTML(v) {
    /* The home page's listing card: photograph behind, the navy veil, the brand
       mark at the top, the panel with city, name and price, and the View button
       that widens on hover. An <a> rather than the home page's <article>,
       because here the card goes somewhere. */
    return '' +
      '<a class="vessel-card" href="' + esc(v.href) + '" target="_blank" rel="noopener">' +
        '<div class="v-img" style="background-image:url(\'' + esc(v.image) + '\')"></div>' +
        '<div class="v-img-veil"></div>' +
        (v.brand ? '<div class="brand"><img src="' + esc(v.brand) + '" alt="' + esc(v.brandAlt) + '" loading="lazy"/></div>' : '') +
        '<div class="info">' +
          '<div class="chip-loc">' + esc(v.location) + '</div>' +
          '<p class="name">' + esc(v.name) + '</p>' +
          '<p class="price">' + esc(v.price) + '</p>' +
        '</div>' +
        '<span class="v-cta" aria-hidden="true">' +
          '<span class="v-cta-text">View</span>' +
          '<span class="v-cta-icon"><i class="fas fa-chevron-right"></i></span>' +
        '</span>' +
      '</a>';
  }

  /* ---------- pagination, likewise ---------- */
  function pageHref(n) {
    var url = new URL(window.location.href);
    url.searchParams.set("page", n);
    return url.pathname + url.search;
  }

  function paginationHTML(page, pages) {
    if (pages <= 1) return "";
    var back = page > 1
      ? '<a href="' + pageHref(page - 1) + '" class="catalog-pagination-nav" data-page="' + (page - 1) + '">' +
        '<span class="catalog-pagination-chevron" aria-hidden="true">&lt;</span> BACK</a>'
      : '<span class="catalog-pagination-nav is-disabled" aria-disabled="true">' +
        '<span class="catalog-pagination-chevron" aria-hidden="true">&lt;</span> BACK</span>';
    var next = page < pages
      ? '<a href="' + pageHref(page + 1) + '" class="catalog-pagination-nav" data-page="' + (page + 1) + '">' +
        'NEXT <span class="catalog-pagination-chevron" aria-hidden="true">&gt;</span></a>'
      : '<span class="catalog-pagination-nav is-disabled" aria-disabled="true">' +
        'NEXT <span class="catalog-pagination-chevron" aria-hidden="true">&gt;</span></span>';

    var nums = "";
    for (var n = 1; n <= pages; n++) {
      nums += n === page
        ? '<span class="catalog-pagination-page is-active" aria-current="page">' + n + '</span>'
        : '<a href="' + pageHref(n) + '" class="catalog-pagination-page" data-page="' + n + '">' + n + '</a>';
    }

    return '<div class="catalog-pagination-back">' + back + '</div>' +
           '<div class="catalog-pagination-pages">' + nums + '</div>' +
           '<div class="catalog-pagination-next">' + next + '</div>';
  }

  /* ---------- sort button label ---------- */
  var SORT_LABELS = {
    "Price|DESC": "Price: High to Low", "Price|ASC": "Price: Low to High",
    "Year|DESC": "Year: Newest to Oldest", "Year|ASC": "Year: Oldest to Newest",
    "Date Added|ASC": "Date added: Ascending", "Date Added|DESC": "Recently Listed",
    "Length|DESC": "Length: Longest to Shortest", "Length|ASC": "Length: Shortest to Longest"
  };

  function syncSort() {
    var p = params();
    var key = (p.get("orderBy") || "Date Added") + "|" + (p.get("order") || "DESC").toUpperCase();
    var label = SORT_LABELS[key] || "Recently Listed";
    var strong = document.querySelector(".catalog-sort-text strong");
    if (strong) strong.textContent = label;
    document.querySelectorAll(".catalog-sort-option").forEach(function (a) {
      var u = new URL(a.getAttribute("href"), window.location.origin);
      var k = (u.searchParams.get("orderBy") || "") + "|" + (u.searchParams.get("order") || "");
      a.classList.toggle("is-active", k === key);
    });
  }

  /* ---------- render ---------- */
  function render() {
    var rows = sorted(filtered());
    var pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    var page = Math.min(Math.max(parseInt(params().get("page"), 10) || 1, 1), pages);

    var grid = document.getElementById("catalogGrid");
    if (grid) {
      var slice = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      grid.innerHTML = slice.length
        ? slice.map(cardHTML).join("")
        : '<p class="catalog-empty">No vessels match these filters.</p>';
    }

    var count = document.getElementById("catalogCount");
    if (count) count.textContent = rows.length;

    var nav = document.getElementById("catalogPagination");
    if (nav) nav.innerHTML = paginationHTML(page, pages);

    syncSort();
    /* The deployed page reloads, which redraws the pills and the panels from the
       URL; here the same job is done by the functions that already exist. */
    if (typeof window.updateAllActiveDisplays === "function") window.updateAllActiveDisplays();
    if (typeof window.syncLocationCheckboxesFromUrl === "function") window.syncLocationCheckboxesFromUrl();
  }

  /* ---------- the sort dropdown ----------
     Its onclick is in the markup, but the function lived in yacht_script.js, which
     is the site's general script and has no business here. Same behaviour: the
     panel takes .show, the button .is-open. */
  window.toggleSortDropdown = function () {
    var dd = document.getElementById("sortDropdown");
    var btn = document.querySelector(".catalog-sort-button");
    if (!dd) return;
    var open = dd.classList.toggle("show");
    if (btn) {
      btn.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };
  window.closeSortDropdown = function () {
    var dd = document.getElementById("sortDropdown");
    var btn = document.querySelector(".catalog-sort-button");
    if (dd) dd.classList.remove("show");
    if (btn) { btn.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
  };
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest("#sortContainer")) window.closeSortDropdown();
  });

  /* ---------- what the panels call ---------- */
  function setParams(set, del) {
    var url = new URL(window.location.href);
    (del || []).forEach(function (k) { url.searchParams.delete(k); });
    Object.keys(set || {}).forEach(function (k) {
      var v = set[k];
      if (v === null || v === undefined || v === "") url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    });
    url.searchParams.set("page", "1");
    window.history.pushState({}, "", url.pathname + url.search);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function takeOver() {
    window.updateUrlAndReload = setParams;

    /* Sort and pagination are ordinary links on the deployed page. */
    document.addEventListener("click", function (e) {
      var sort = e.target.closest && e.target.closest(".catalog-sort-option");
      if (sort) {
        e.preventDefault();
        var u = new URL(sort.getAttribute("href"), window.location.origin);
        setParams({ orderBy: u.searchParams.get("orderBy"), order: u.searchParams.get("order") });
        if (typeof window.closeSortDropdown === "function") window.closeSortDropdown();
        var dd = document.getElementById("sortDropdown");
        if (dd) dd.classList.remove("is-open", "show", "open");
        return;
      }
      var pg = e.target.closest && e.target.closest("[data-page]");
      if (pg) {
        e.preventDefault();
        var url = new URL(window.location.href);
        url.searchParams.set("page", pg.dataset.page);
        window.history.pushState({}, "", url.pathname + url.search);
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    window.addEventListener("popstate", render);
    render();
  }

  /* yacht_catalog.js sets its panels up on DOMContentLoaded; this runs after it. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(takeOver, 0); });
  } else {
    setTimeout(takeOver, 0);
  }
})();
