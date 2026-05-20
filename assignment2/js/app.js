// STATE
let allListings = [];
let activeVibes = new Set();
let gemOnly = false;

// Vibe filter rules — each maps a tag key to a listing test function
const VIBE_RULES = {
  wifi: (l) => hasAmenity(l, "dedicated workspace") || hasAmenity(l, "desk"),
  kitchen: (l) => hasAmenity(l, "kitchen"),
  pets: (l) =>
    hasAmenity(l, "pets allowed") ||
    hasAmenity(l, "dog") ||
    hasAmenity(l, "cat"),
  family: (l) =>
    hasAmenity(l, "crib") || hasAmenity(l, "children") || l.accommodates >= 4,
  luxury: (l) =>
    hasAmenity(l, "bathtub") ||
    hasAmenity(l, "hot tub") ||
    priceNum(l.price) >= 300,
  instant: (l) => l.instant_bookable === "t",
  superhost: (l) => l.host_is_superhost === "t",
};

// Hidden gem scoring: high rating + low reviews + good value
// Hard disqualifiers keep popular listings out regardless of score
function gemScore(listing) {
  const rating = listing.review_scores_rating ?? 0;
  const reviews = listing.number_of_reviews ?? 0;
  const price = priceNum(listing.price) ?? 999;

  if (rating < 4.7 || reviews === 0 || reviews > 75) return 0;

  const ratingScore = (rating - 4.7) / 0.3; // 0 at 4.7, 1 at 5.0
  const noveltyScore = Math.max(0, 1 - reviews / 75); // 1 at 1 review, 0 at 75
  const valueScore = Math.max(0, 1 - price / 400);

  return ratingScore * 0.5 + noveltyScore * 0.35 + valueScore * 0.15;
}

const GEM_THRESHOLD = 0.35;

// HELPERS
function hasAmenity(listing, keyword) {
  return listing.amenities.some((a) => a.toLowerCase().includes(keyword));
}

function priceNum(priceStr) {
  return parseFloat((priceStr || "0").replace(/[^0-9.]/g, ""));
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Strips Airbnb's "Type in City · ★X.XX · N bed · N bath" suffix
function cleanName(name) {
  return name.replace(/·\s*★[\d.]+.*$/, "").trim();
}

async function fetchListings() {
  const res = await fetch("./data/listings.json");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// RENDER
function renderCard(listing, index) {
  const template = document.getElementById("card-template");
  const card = template.content.cloneNode(true).querySelector(".listing-card");
  const front = card.querySelector(".card-front");
  const back = card.querySelector(".card-back");

  card.dataset.id = listing.id;
  setTimeout(() => card.classList.add("card-visible"), index * 60);

  // Gem score cached on listing for instant filtering
  listing._gemScore = gemScore(listing);
  if (listing._gemScore >= GEM_THRESHOLD) {
    card.querySelector(".gem-badge").classList.remove("hidden");
  }

  // Front face
  const thumb = front.querySelector(".card-thumb");
  thumb.src = listing.picture_url || "";
  thumb.alt = cleanName(listing.name);
  thumb.onerror = () => {
    thumb.onerror = null;
    thumb.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E1DCC9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23412D15'%3ENo photo%3C/text%3E%3C/svg%3E`;
  };

  front.querySelector(".card-room-type").textContent = listing.room_type || "";
  front.querySelector(".host-name").textContent = listing.host_name || "Host";
  front.querySelector(".rating-value").textContent =
    listing.review_scores_rating?.toFixed(2) ?? "—";
  front.querySelector(".rating-count").textContent = listing.number_of_reviews
    ? `(${listing.number_of_reviews})`
    : "";
  front.querySelector(".card-name").textContent = cleanName(listing.name);
  front.querySelector(".card-neighbourhood").textContent =
    listing.neighbourhood || "";
  front.querySelector(".price-value").textContent = listing.price || "—";

  const avatar = front.querySelector(".host-avatar");
  avatar.src = listing.host_picture_url || "";
  avatar.onerror = () => {
    avatar.style.display = "none";
  };

  if (listing.host_is_superhost === "t") {
    front.querySelector(".superhost-badge").classList.remove("hidden");
  }

  const descRaw = stripHtml(listing.description || "").trim();
  const descEl = front.querySelector(".card-description");
  const moreBtn = front.querySelector(".read-more");
  descEl.textContent = descRaw || "No description available.";
  if (descRaw.length > 180) {
    moreBtn.classList.remove("hidden");
    moreBtn.textContent = "Read more";
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const expanded = descEl.classList.toggle("expanded");
      moreBtn.textContent = expanded ? "Show less" : "Read more";
    });
  }

  // Amenity pills: auto-scroll on card hover + manual drag
  const amenities = listing.amenities || [];
  const pillsWrap = front.querySelector(".amenity-pills");
  const track = document.createElement("div");
  track.className = "amenity-pills-track";
  amenities.forEach((a) => {
    const pill = document.createElement("span");
    pill.className = "amenity-pill";
    pill.textContent = a;
    track.appendChild(pill);
  });
  pillsWrap.appendChild(track);

  requestAnimationFrame(() => {
    const overflow = track.scrollWidth - pillsWrap.offsetWidth;
    if (overflow <= 0) return;

    pillsWrap.style.setProperty("--scroll-dist", `-${overflow}px`);
    pillsWrap.style.setProperty(
      "--scroll-duration",
      `${Math.max(3, overflow / 40)}s`,
    );
    pillsWrap.dataset.fade = "right";

    function updateFade() {
      const sl = pillsWrap.scrollLeft;
      const max = pillsWrap.scrollWidth - pillsWrap.clientWidth;
      pillsWrap.dataset.fade =
        sl < 8 ? "right" : sl > max - 8 ? "left" : "both";
    }

    let isDragging = false,
      startX = 0;

    pillsWrap.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX;
      pillsWrap.classList.add("drag-active", "is-dragging");
      track.style.transition = "none";
      track.style.transform = "translateX(0)";
      pillsWrap.scrollLeft = 0;
      updateFade();
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      pillsWrap.scrollLeft = Math.max(0, Math.min(startX - e.pageX, overflow));
      updateFade();
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      pillsWrap.classList.remove("is-dragging");
    });

    front.addEventListener("mouseleave", () => {
      if (isDragging) return;
      pillsWrap.classList.remove("drag-active");
      pillsWrap.scrollLeft = 0;
      track.style.transition = "";
      track.style.transform = "";
      pillsWrap.dataset.fade = "right";
    });
  });

  // Back face
  const backAvatar = back.querySelector(".back-avatar");
  backAvatar.src = listing.host_picture_url || "";
  backAvatar.onerror = () => {
    backAvatar.style.display = "none";
  };

  back.querySelector(".back-host-name").textContent =
    listing.host_name || "Host";
  back.querySelector(".back-rating-value").textContent =
    listing.review_scores_rating?.toFixed(2) ?? "—";
  back.querySelector(".back-rating-count").textContent =
    listing.number_of_reviews ? `(${listing.number_of_reviews})` : "";
  back.querySelector(".back-name").textContent = cleanName(listing.name);
  back.querySelector(".back-neighbourhood").textContent =
    listing.neighbourhood || "";
  back.querySelector(".back-beds").textContent = listing.beds ?? "—";
  back.querySelector(".back-bedrooms").textContent = listing.bedrooms ?? "—";
  back.querySelector(".back-accommodates").textContent =
    listing.accommodates ?? "—";
  back.querySelector(".back-price").textContent = listing.price || "—";
  back.querySelector(".back-description").textContent =
    descRaw || "No description available.";

  if (listing.host_is_superhost === "t") {
    back.querySelector(".back-superhost").classList.remove("hidden");
  }

  const backAmenities = back.querySelector(".back-amenities");
  amenities.forEach((a) => {
    const pill = document.createElement("span");
    pill.className = "amenity-pill";
    pill.textContent = a;
    backAmenities.appendChild(pill);
  });

  const avail = {
    30: listing.availability_30 ?? 0,
    60: listing.availability_60 ?? 0,
    90: listing.availability_90 ?? 0,
  };
  back.querySelector(".back-avail-30").textContent = avail[30];
  back.querySelector(".back-avail-60").textContent = avail[60];
  back.querySelector(".back-avail-90").textContent = avail[90];
  back.querySelectorAll(".avail-bar-fill").forEach((bar) => {
    const p = parseInt(bar.dataset.avail);
    bar.style.width = `${Math.round((avail[p] / p) * 100)}%`;
  });

  // Flip: pin back height to card at click time so it fills correctly
  card.addEventListener("click", () => {
    if (!card.classList.contains("is-flipped")) {
      back.style.height = `${card.offsetHeight}px`;
      card.classList.add("is-flipped");
    }
  });

  back.querySelector(".back-close").addEventListener("click", (e) => {
    e.stopPropagation();
    card.classList.remove("is-flipped");
  });

  return card;
}

function renderAll(listings) {
  const grid = document.getElementById("listings-grid");
  grid.innerHTML = "";
  listings.forEach((listing, i) => grid.appendChild(renderCard(listing, i)));
  updateCount(listings.length);
}

// FILTER
function applyFilters() {
  const filtered = allListings.filter((l) => {
    const vibePass =
      activeVibes.size === 0
        ? true
        : [...activeVibes].every((v) => VIBE_RULES[v]?.(l));
    return vibePass && (gemOnly ? l._gemScore >= GEM_THRESHOLD : true);
  });

  const grid = document.getElementById("listings-grid");
  const cards = Array.from(grid.querySelectorAll(".listing-card"));
  const empty = document.getElementById("empty-state");
  const passIds = new Set(filtered.map((l) => String(l.id)));

  // Flip any open cards back
  cards.forEach((c) => c.classList.remove("is-flipped"));

  // Step 1: fade all cards out simultaneously
  cards.forEach((card) => {
    card.classList.remove("card-visible", "filtered-in");
    card.classList.add("filter-exit");
  });

  // Step 2: after fade-out, hide non-matching and stagger matching back in
  setTimeout(() => {
    let staggerIndex = 0;

    cards.forEach((card) => {
      card.classList.remove("filter-exit");
      if (passIds.has(card.dataset.id)) {
        card.style.display = "";
        // Reset to entry state then stagger in
        card.classList.remove("card-visible");
        setTimeout(() => card.classList.add("card-visible"), staggerIndex * 60);
        staggerIndex++;
      } else {
        card.style.display = "none";
      }
    });

    empty.classList.toggle("hidden", filtered.length > 0);
    updateCount(filtered.length);
  }, 300);

  updateCount(filtered.length);
}

function updateCount(n) {
  document.getElementById("listing-count").innerHTML =
    `Showing <strong>${n}</strong> listing${n !== 1 ? "s" : ""}`;
}

// INIT
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const icon = btn.querySelector(".theme-icon");
  const html = document.documentElement;

  // Respect OS preference on first load
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.setAttribute("data-theme", "dark");
    icon.textContent = "☾";
  }

  btn.addEventListener("click", () => {
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    icon.textContent = isDark ? "☀" : "☾";
  });
}

function initVibeTags() {
  const tags = document.querySelectorAll(".vibe-tag");
  const allTag = document.querySelector('.vibe-tag[data-vibe="all"]');

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const vibe = tag.dataset.vibe;

      if (vibe === "all") {
        activeVibes.clear();
        tags.forEach((t) => t.classList.remove("active"));
        allTag.classList.add("active");
      } else {
        allTag.classList.remove("active");
        if (activeVibes.has(vibe)) {
          activeVibes.delete(vibe);
          tag.classList.remove("active");
          if (activeVibes.size === 0) allTag.classList.add("active");
        } else {
          activeVibes.add(vibe);
          tag.classList.add("active");
        }
      }

      applyFilters();
    });
  });
}

function initGemToggle() {
  const checkbox = document.getElementById("gem-toggle");
  checkbox.addEventListener("change", () => {
    gemOnly = checkbox.checked;
    applyFilters();
  });
}

function initReset() {
  document.getElementById("reset-btn").addEventListener("click", () => {
    activeVibes.clear();
    document.querySelectorAll(".vibe-tag").forEach((t) => {
      t.classList.toggle("active", t.dataset.vibe === "all");
    });
    gemOnly = false;
    document.getElementById("gem-toggle").checked = false;
    applyFilters();
  });
}

async function init() {
  const loading = document.getElementById("loading-state");
  const grid = document.getElementById("listings-grid");

  initTheme();
  initVibeTags();
  initGemToggle();
  initReset();

  try {
    loading.classList.remove("hidden");
    grid.style.display = "none";

    allListings = await fetchListings();

    loading.classList.add("hidden");
    grid.style.display = "";
    renderAll(allListings);
  } catch (err) {
    loading.innerHTML = `
      <p style="color:var(--text-muted);font-size:0.9rem;">
        Could not load listings. Make sure you're running a local server
        and <code>data/listings.json</code> exists.<br/>
        <small>${err.message}</small>
      </p>`;
  }
}

document.addEventListener("DOMContentLoaded", init);
