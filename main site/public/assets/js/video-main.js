/* =========================================================
   CryptoRocket Video Library — homepage renderer

   Fetches videos.json (auto-generated from the .txt files inside
   /videos/<category>/ by scripts/build_video_index.py + the GitHub Action)
   and renders the ticker tape, category filters, video grid, and
   the click-to-play modal.

   You never need to edit this file to add a new video — just drop a
   .txt file with the video link into the right /videos/<category>/
   folder and push.
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

let ALL_VIDEOS = [];
let ACTIVE_FILTER = "all";

async function loadVideos() {
  try {
    const res = await fetch("videos.json", { cache: "no-store" });
    if (!res.ok) throw new Error("videos.json not found");
    ALL_VIDEOS = await res.json();
  } catch (err) {
    console.warn("Could not load videos.json yet:", err);
    ALL_VIDEOS = [];
  }
  renderTicker();
  renderFilters();
  renderGrid();
  renderClock();
  setupModal();
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

  if (ALL_VIDEOS.length === 0) {
    track.innerHTML = `<span class="ticker-item"><span class="ticker-dot" style="background:var(--gold)"></span>
      Drop your first video link into /videos to see it here</span>`;
    return;
  }

  const items = [...ALL_VIDEOS, ...ALL_VIDEOS]
    .map((v, i) => {
      const color = categoryColor(v.category);
      const idx = i % ALL_VIDEOS.length;
      return `<button class="ticker-item" data-index="${idx}">
        <span class="ticker-dot" style="background:${color}"></span>
        <span class="ticker-title">${escapeHtml(v.title)}</span>
      </button>`;
    })
    .join("");

  track.innerHTML = items;

  track.querySelectorAll(".ticker-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const video = ALL_VIDEOS[Number(btn.dataset.index)];
      if (video) openModal(video);
    });
  });
}

function renderFilters() {
  const bar = document.getElementById("filter-bar");
  if (!bar) return;

  const counts = { all: ALL_VIDEOS.length };
  CATEGORY_ORDER.forEach((cat) => {
    counts[cat] = ALL_VIDEOS.filter((v) => v.category === cat).length;
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
  const grid = document.getElementById("video-grid");
  const empty = document.getElementById("empty-state");
  if (!grid) return;

  const visible =
    ACTIVE_FILTER === "all" ? ALL_VIDEOS : ALL_VIDEOS.filter((v) => v.category === ACTIVE_FILTER);

  if (visible.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  grid.innerHTML = visible
    .map((v) => {
      const color = categoryColor(v.category);
      const globalIndex = ALL_VIDEOS.indexOf(v);
      const thumb = v.thumbnail
        ? `<img src="${v.thumbnail}" alt="" loading="lazy">`
        : `<div class="video-thumb-fallback">${escapeHtml(v.categoryLabel || v.category)}</div>`;

      return `
      <article class="video-card" data-index="${globalIndex}">
        <div class="video-thumb">
          ${thumb}
          <span class="thumb-category-tag" style="--card-accent:${color}">${escapeHtml(v.categoryLabel || v.category)}</span>
          <div class="play-badge">${playIconSvg()}</div>
        </div>
        <div class="video-info">
          <h3>${escapeHtml(v.title)}</h3>
          <div class="video-meta">
            <span>${escapeHtml(v.author || "CryptoRocket")}</span>
            <span>${formatDate(v.date)}</span>
          </div>
          ${v.description ? `<p class="video-desc">${escapeHtml(v.description)}</p>` : ""}
        </div>
      </article>`;
    })
    .join("");

  grid.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
      const video = ALL_VIDEOS[Number(card.dataset.index)];
      if (video) openModal(video);
    });
  });
}

function playIconSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="rgba(10,12,16,0.55)" stroke="white" stroke-opacity="0.85"/>
    <path d="M9.5 7.5L16.5 12L9.5 16.5V7.5Z" fill="white"/>
  </svg>`;
}

function setupModal() {
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal(video) {
  const overlay = document.getElementById("modal-overlay");
  const player = document.getElementById("modal-player");
  const titleEl = document.getElementById("modal-title");
  const metaEl = document.getElementById("modal-meta");
  const descEl = document.getElementById("modal-desc");
  const externalEl = document.getElementById("modal-external");
  if (!overlay || !player) return;

  if (video.embedUrl) {
    player.innerHTML = `<iframe src="${video.embedUrl}" title="${escapeHtml(video.title)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  } else {
    player.innerHTML = `<div class="video-thumb-fallback" style="height:100%;">
      This provider can't be embedded — use "Watch on original site" below.</div>`;
  }

  titleEl.textContent = video.title;
  metaEl.textContent = `${video.author || "CryptoRocket"} · ${formatDate(video.date)} · ${video.categoryLabel || video.category}`;
  descEl.textContent = video.description || "";
  externalEl.href = video.sourceUrl;

  overlay.classList.add("open");
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  const player = document.getElementById("modal-player");
  if (!overlay) return;
  overlay.classList.remove("open");
  if (player) player.innerHTML = ""; // stop playback
}

function renderClock() {
  const el = document.getElementById("nav-clock");
  if (!el) return;
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleString("en-US", { weekday: "short", hour: "2-digit", minute: "2-digit" });
  };
  update();
  setInterval(update, 30000);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadVideos);
