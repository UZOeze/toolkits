/* =========================================================
   CryptoRocket Blog — homepage renderer

   Fetches posts.json (auto-generated from the HTML files inside
   /posts/<category>/ by scripts/build_index.py + the GitHub Action)
   and renders the ticker tape, category filters, and article grid.

   You never need to edit this file to add a new post — just drop
   an HTML file into the right /posts/<category>/ folder and push.
   ========================================================= */

const CATEGORY_ORDER = ["sports", "forex", "crypto", "polymarket"];

const CATEGORY_LABELS = {
  sports: "Sports",
  forex: "Forex",
  crypto: "Crypto",
  polymarket: "Polymarket",
};

const CATEGORY_VARS = {
  sports: "--cat-sports",
  forex: "--cat-forex",
  crypto: "--cat-crypto",
  polymarket: "--cat-polymarket",
};

let ALL_ARTICLES = [];
let ACTIVE_FILTER = "all";

async function loadArticles() {
  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    if (!res.ok) throw new Error("posts.json not found");
    ALL_ARTICLES = await res.json();
  } catch (err) {
    console.warn("Could not load posts.json yet:", err);
    ALL_ARTICLES = [];
  }
  renderTicker();
  renderFilters();
  renderGrid();
  renderClock();
}

function categoryColor(category) {
  const varName = CATEGORY_VARS[category] || "--gold";
  return `var(${varName})`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function renderTicker() {
  const track = document.getElementById("ticker-track");
  if (!track) return;

  if (ALL_ARTICLES.length === 0) {
    track.innerHTML = `<span class="ticker-item"><span class="ticker-dot" style="background:var(--gold)"></span>
      Drop your first article into /posts to see it here</span>`;
    return;
  }

  // Duplicate the list so the CSS animation (translateX -50%) loops seamlessly.
  const items = [...ALL_ARTICLES, ...ALL_ARTICLES]
    .map((a) => {
      const color = categoryColor(a.category);
      return `<a class="ticker-item" href="${a.url}">
        <span class="ticker-dot" style="background:${color}"></span>
        <span class="ticker-title">${escapeHtml(a.title)}</span>
      </a>`;
    })
    .join("");

  track.innerHTML = items;
}

function renderFilters() {
  const bar = document.getElementById("filter-bar");
  if (!bar) return;

  const counts = { all: ALL_ARTICLES.length };
  CATEGORY_ORDER.forEach((cat) => {
    counts[cat] = ALL_ARTICLES.filter((a) => a.category === cat).length;
  });

  const buttons = [
    `<button class="filter-btn ${ACTIVE_FILTER === "all" ? "active" : ""}" data-filter="all">
      All <span class="filter-count">${counts.all}</span>
    </button>`,
    ...CATEGORY_ORDER.map((cat) => {
      const color = categoryColor(cat);
      return `<button class="filter-btn ${ACTIVE_FILTER === cat ? "active" : ""}" data-filter="${cat}">
        <span class="filter-dot" style="background:${color}"></span>
        ${CATEGORY_LABELS[cat]} <span class="filter-count">${counts[cat]}</span>
      </button>`;
    }),
  ];

  bar.innerHTML = buttons.join("");

  bar.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      ACTIVE_FILTER = btn.dataset.filter;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const grid = document.getElementById("article-grid");
  const empty = document.getElementById("empty-state");
  if (!grid) return;

  const visible =
    ACTIVE_FILTER === "all"
      ? ALL_ARTICLES
      : ALL_ARTICLES.filter((a) => a.category === ACTIVE_FILTER);

  if (visible.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  grid.innerHTML = visible
    .map((a) => {
      const color = categoryColor(a.category);
      return `
      <a class="article-card" style="--card-accent: ${color}" href="${a.url}">
        <div class="card-meta">
          <span class="card-category">${escapeHtml(a.categoryLabel || a.category)}</span>
          <span class="card-date">${formatDate(a.date)}</span>
        </div>
        <h3>${escapeHtml(a.title)}</h3>
        ${a.excerpt ? `<p class="card-excerpt">${escapeHtml(a.excerpt)}</p>` : ""}
        <span class="card-readmore">Read article <span class="arrow">&rarr;</span></span>
      </a>`;
    })
    .join("");
}

function renderClock() {
  const el = document.getElementById("nav-clock");
  if (!el) return;
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  update();
  setInterval(update, 30000);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadArticles);
